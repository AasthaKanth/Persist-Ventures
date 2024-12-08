import Content from '../models/Content.js';
import PollinationsService from '../services/PollinationsService.js';
import VideoService from '../services/VideoService.js';
import NotificationService from '../services/NotificationService.js';
import path from 'path';
import fs from 'fs/promises';

export const generateContent = async (req, res) => {
  try {
    const { prompt, notificationTime } = req.body;
    
    // Create content entry
    const content = await Content.create({
      prompt,
      status: 'Processing',
      notificationTime: notificationTime ? new Date(notificationTime) : null,
      UserId: req.user.id
    });

    // Ensure user content directory exists
    const userContentDir = path.join(process.cwd(), 'generated_content', req.user.id.toString());
    await fs.mkdir(userContentDir, { recursive: true });

    // Generate content asynchronously
    const [imageUrls, videoUrls] = await Promise.all([
      PollinationsService.generateImages(prompt, req.user.id),
      VideoService.generateVideos(prompt)
    ]);

    content.imageUrls = imageUrls;
    content.videoUrls = videoUrls;
    content.status = 'Completed';
    await content.save();

    // Schedule notification if time is specified
    if (notificationTime) {
      NotificationService.scheduleNotification(content, req.user);
    }

    res.json(content);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserContent = async (req, res) => {
  try {
    const contents = await Content.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};