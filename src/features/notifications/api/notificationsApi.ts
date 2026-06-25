import axios, { type AxiosError } from 'axios';

import { API_BASE_URL } from '../../../config/api';
import type { NotificationItem } from '../data/notifications';

const NOTIFICATIONS_ROUTE = `${API_BASE_URL}/api/notifications`;
const API_REQUEST_TIMEOUT_MS = 8000;

type NotificationApiItem = Partial<NotificationItem> & {
  _id?: string;
  body?: string;
  createdAt?: string;
  created_at?: string;
  description?: string;
  message?: string;
  read?: boolean;
  status?: string;
  type?: string;
  updatedAt?: string;
  updated_at?: string;
};

type NotificationsResponse = {
  data?: NotificationApiItem[] | { notifications?: NotificationApiItem[] };
  notifications?: NotificationApiItem[];
  success?: boolean;
};

type FetchNotificationsParams = {
  token?: string | null;
  companyId?: string | null;
};

function asNotificationArray(value: unknown): NotificationApiItem[] {
  return Array.isArray(value) ? value : [];
}

function getResponseNotifications(data: NotificationsResponse) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  const directNotifications = asNotificationArray(data.notifications);

  if (directNotifications.length > 0) {
    return directNotifications;
  }

  return asNotificationArray(data.data?.notifications);
}

function getNotificationTime(item: NotificationApiItem) {
  return formatUsDate(
    item.time ?? item.createdAt ?? item.created_at ?? item.updatedAt ?? item.updated_at ?? '',
  );
}

function formatUsDate(value: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function normalizeNotification(item: NotificationApiItem, index: number): NotificationItem {
  return {
    id: item.id ?? item._id ?? `notification-${index}`,
    title: item.title ?? item.type ?? 'Notification',
    message: item.message ?? item.body ?? item.description ?? '',
    time: getNotificationTime(item),
    icon: item.icon ?? 'bell-o',
    isRead: item.isRead ?? item.read ?? item.status === 'read',
  };
}

export async function fetchNotifications({ token, companyId }: FetchNotificationsParams = {}) {
  const route = companyId ? `${NOTIFICATIONS_ROUTE}/company/${companyId}` : NOTIFICATIONS_ROUTE;

  try {
    const response = await axios.get<NotificationsResponse>(route, {
      headers: token
        ? {
          Authorization: `Bearer ${token}`,
          'x-auth-token': token,
        }
        : undefined,
      timeout: API_REQUEST_TIMEOUT_MS,
    });

    return {
      error: '',
      isSuccess: response.data.success ?? true,
      notifications: getResponseNotifications(response.data).map(normalizeNotification),
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    console.log('Notifications API error', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      url: route,
    });

    return {
      error:
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error ??
        axiosError.message ??
        'Unable to load notifications.',
      isSuccess: false,
      notifications: [],
    };
  }
}
