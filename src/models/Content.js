import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Content = sequelize.define('Content', {
  prompt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  videoUrls: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  imageUrls: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Processing', 'Completed', 'Failed'),
    defaultValue: 'Processing'
  },
  notificationTime: {
    type: DataTypes.DATE
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

export default Content;