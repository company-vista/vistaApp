export const notifications = [
  {
    id: 'invoice-reminder',
    title: 'Invoice reminder',
    message: 'INV-202604-0017 is still pending.',
    time: '10 min ago',
    icon: 'file-text-o',
    isRead: false,
  },
  {
    id: 'compliance-update',
    title: 'Compliance update',
    message: 'Your company filing checklist was updated.',
    time: '1 hour ago',
    icon: 'check-square-o',
    isRead: false,
  },
  {
    id: 'support-reply',
    title: 'Support reply',
    message: 'Our team replied to your recent request.',
    time: 'Yesterday',
    icon: 'comments-o',
    isRead: true,
  },
];

export type NotificationItem = (typeof notifications)[number];
