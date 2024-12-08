let token = localStorage.getItem('token');
const API_URL = '/api';

// Auth toggle
document.getElementById('toggleAuth').addEventListener('click', (e) => {
    e.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const isLogin = loginForm.querySelector('h2').textContent === 'Login';
    
    loginForm.querySelector('h2').textContent = isLogin ? 'Register' : 'Login';
    document.getElementById('toggleAuth').textContent = isLogin ? 'Have an account? Login' : 'Need an account? Register';
});

// Login/Register form
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const isLogin = document.querySelector('#loginForm h2').textContent === 'Login';
    const endpoint = isLogin ? 'auth/login' : 'auth/register';
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error);
        
        if (isLogin) {
            token = result.token;
            localStorage.setItem('token', token);
            showContentSection();
            loadUserContent();
        } else {
            // Switch to login after successful registration
            document.querySelector('#loginForm h2').textContent = 'Login';
            document.getElementById('toggleAuth').textContent = 'Need an account? Register';
            alert('Registration successful! Please login.');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Generate content form
document.getElementById('generateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        prompt: formData.get('prompt'),
        notificationTime: formData.get('notificationTime') || null
    };

    try {
        const response = await fetch(`${API_URL}/content/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        alert('Content generation started!');
        loadUserContent();
        e.target.reset();
    } catch (error) {
        alert(error.message);
    }
});

async function loadUserContent() {
    try {
        const response = await fetch(`${API_URL}/content/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const contents = await response.json();
        if (!response.ok) throw new Error(contents.error);

        const contentItems = document.getElementById('contentItems');
        contentItems.innerHTML = contents.map(content => `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="mb-4">
                    <h3 class="text-xl font-semibold">Prompt: ${content.prompt}</h3>
                    <p class="text-gray-600">Status: ${content.status}</p>
                    <p class="text-gray-600">Generated: ${new Date(content.generated_at).toLocaleString()}</p>
                </div>
                ${content.status === 'Completed' ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold mb-2">Images</h4>
                            <div class="grid grid-cols-2 gap-2">
                                ${content.imageUrls.map(url => `
                                    <img src="${url}" alt="Generated image" class="w-full h-32 object-cover rounded">
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">Videos</h4>
                            <div class="grid grid-cols-1 gap-2">
                                ${content.videoUrls.map(url => `
                                    <video controls class="w-full rounded">
                                        <source src="${url}" type="video/mp4">
                                    </video>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function showContentSection() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('contentSection').classList.remove('hidden');
}

// Check if user is already logged in
if (token) {
    showContentSection();
    loadUserContent();
}