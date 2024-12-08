import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from './config/database.js';
import User from './models/User.js';
import Content from './models/Content.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Trust first proxy
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(join(__dirname, '../public')));
app.use('/generated_content', express.static(join(__dirname, '../generated_content')));

// Set up relationships
User.hasMany(Content);
Content.belongsTo(User);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
sequelize.sync().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});