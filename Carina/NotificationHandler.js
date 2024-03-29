import {COLORS} from './colors.js';
import PushNotification from 'react-native-push-notification';
import moment, {isMoment} from 'moment';

const CHANNEL_ID = 'not1';
const NOT_DONE = 0;
const DONE = 1;
const DELETED = 2;

PushNotification.configure({
  onNotification: function (notification) {
  },

  onAction: function (notification) {
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.localNotification({
  title: 'My Notification Title', // (optional)
  message: 'My Notification Message', // (required)
});
PushNotification.createChannel(
  {
    channelId: CHANNEL_ID,
    channelName: 'Carina Channel',
    channelDescription:
      'Channel for sending, scheduling and managing notifications',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

export const send = (todo) => {
  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    id: todo.id,
    title: todo.title || 'Test Title',
    message: `${todo.title} is due today`,
  });
};

export const schedule = (todo) => {
  PushNotification.localNotificationSchedule({
    largeIcon: 'ic_launcher',
    largeIconUrl: 'ic_notification',
    smallIcon: 'ic_notification',
    channelId: CHANNEL_ID,
    color: COLORS.mainLight,
    id: todo.id,
    title: todo.title,
    message: `${todo.title} should be done by now`,
    date: isMoment(todo.due_date)
      ? todo.due_date.toDate()
      : moment(todo.due_date).toDate(),
  });
};

export const getNotifications = () => {
};
export const cancelNotification = (todo_id) => {
  PushNotification.cancelLocalNotifications({id: todo_id});
};

export const scheduleAll = (todos) => {
  PushNotification.cancelAllLocalNotifications();
  todos.map((todo) => {
    if (todo.due_date && todo.state === NOT_DONE && todo.has_time) {
      let isOverdue = moment().isAfter(moment(todo.due_date));
      if (!isOverdue) {
        schedule(todo);
      }
    }
  });
};
