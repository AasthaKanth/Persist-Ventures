import sys
import subprocess

def install_dependencies():
    try:
        subprocess.check_call([sys.executable, '-m', 'ensurepip', '--user'])
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--user', '--upgrade', 'pip'])
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--user', '-r', 'requirements.txt'])
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        sys.exit(1)

if __name__ == "__main__":
    install_dependencies()
    
    try:
        from fastapi import FastAPI
        import uvicorn
        from app.database import engine, Base
        from app.routers import users, content, auth
        
        # Create database tables
        Base.metadata.create_all(bind=engine)
        
        app = FastAPI(title="AI Content Generator")
        
        # Include routers
        app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
        app.include_router(users.router, prefix="/users", tags=["Users"])
        app.include_router(content.router, prefix="/content", tags=["Content"])
        
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except ImportError as e:
        print(f"Error importing required modules: {e}")
        print("Please ensure all dependencies are installed correctly.")
        sys.exit(1)