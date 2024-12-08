import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Models
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING
});

const Content = sequelize.define('Content', {
  prompt: DataTypes.STRING,
  videoUrls: DataTypes.JSON,
  imageUrls: DataTypes.JSON,
  status: DataTypes.STRING,
  notificationTime: DataTypes.DATE
});

User.hasMany(Content);
Content.belongsTo(User);

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error('User not found');
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/generate', authenticate, async (req, res) => {
  try {
    const { prompt, notificationTime } = req.body;
    
    // Create content entry
    const content = await Content.create({
      prompt,
      status: 'Processing',
      notificationTime,
      UserId: req.user.id
    });

    // Generate images using Pollinations AI
    const imageResponse = await fetch('https://api.pollinations.ai/v1/imagine/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        negative_prompt: 'ugly, blurry, low quality',
        num_images: 5,
        width: 512,
        height: 512
      })
    });
    
    const imageData = await imageResponse.json();
    
    // Update content with generated URLs
    content.imageUrls = imageData.images || [];
    content.status = 'Completed';
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/content', authenticate, async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { UserId: req.user.id }
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});