import schedule from 'node-schedule';

class NotificationService {
  scheduleNotification(content, user) {
    if (!content.notificationTime) return;

    schedule.scheduleJob(content.notificationTime, async () => {
      try {
        // In a real application, you would send an email or push notification here
        console.log(`Notification for user ${user.email}: Your content "${content.prompt}" is ready!`);
        console.log(`View your content at: /content/${content.id}`);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    });
  }
}

export default new NotificationService();