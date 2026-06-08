import axios, { type AxiosError } from 'axios';
import Toast from 'react-native-toast-message';

export type LoginErrors = {
  email?: string;
  password?: string;
};

export type LoginUser = {
  avatar?: string;
  company?: string;
  email: string;
  firstName?: string;
  image?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  photo?: string;
  profileImage?: string;
  profilePicture?: string;
  role?: string;
};

type LoginApiParams = {
  email: string;
  password: string;
};

type LoginApiResult = {
  errors: LoginErrors;
  isSuccess: boolean;
  email: string;
  token?: string;
  user?: LoginUser;
};

const API_BASE_URL = 'http://192.168.1.43:5000';
const LOGIN_ROUTE = `${API_BASE_URL}/api/auth/login`;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type LoginApiResponse = {
  data?: LoginApiResponse | LoginUser;
  message?: string;
  profile?: LoginUser;
  token?: string;
  user?: LoginUser;
  client?: LoginUser;
};

function getResponseUser(data: LoginApiResponse): LoginUser | undefined {
  const nestedData = data.data && !('email' in data.data) ? data.data : undefined;
  const directDataUser = data.data && 'email' in data.data ? data.data : undefined;

  return data.user ?? data.profile ?? data.client ?? directDataUser ?? nestedData?.user ?? nestedData?.profile ?? nestedData?.client;
}

function getResponseToken(data: LoginApiResponse) {
  const nestedData = data.data && !('email' in data.data) ? data.data : undefined;

  return data.token ?? nestedData?.token ?? '';
}

function getImageUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${API_BASE_URL}/${value.replace(/^\/+/, '')}`;
}

function getUserName(user?: LoginUser) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();

  return user?.name ?? (fullName || undefined);
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const requestError = axiosError.request as { _response?: string } | undefined;

  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    requestError?._response ??
    axiosError.message ??
    'Unable to login. Please try again.'
  );
}

export async function handleLoginApi({
  email,
  password,
}: LoginApiParams): Promise<LoginApiResult> {
  const errors: LoginErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    Toast.show({
      type: 'error',
      text1: 'Login failed',
      text2: 'Please check your email and password.',
    });

    return {
      errors,
      isSuccess: false,
      email: trimmedEmail,
    };
  }

  try {
    const response = await axios.post<LoginApiResponse>(LOGIN_ROUTE, {
      email: trimmedEmail,
      password,
    });
    const user = getResponseUser(response.data);
    const token = getResponseToken(response.data);
    const loginUser: LoginUser = {
      avatar: getImageUrl(user?.avatar),
      company: user?.company,
      email: user?.email ?? trimmedEmail,
      firstName: user?.firstName,
      image: getImageUrl(user?.image),
      lastName: user?.lastName,
      name: getUserName(user),
      phone: user?.phone,
      photo: getImageUrl(user?.photo),
      profileImage: getImageUrl(user?.profileImage),
      profilePicture: getImageUrl(user?.profilePicture),
      role: user?.role,
    };
    console.log('Login user saved', loginUser);
    console.log(response)
    Toast.show({
      type: 'success',
      text1: 'Login successful',
      text2: response.data.message ?? 'Profile loaded successfully.',
    });

    return {
      errors,
      isSuccess: true,
      email: loginUser.email,
      token,
      user: loginUser,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const requestError = axiosError.request as { _response?: string } | undefined;

    console.log('Login API error', {
      code: axiosError.code,
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      requestResponse: requestError?._response,
      url: LOGIN_ROUTE,
    });
    const message = getErrorMessage(error);

    Toast.show({
      type: 'error',
      text1: 'Login failed',
      text2: message,
    });

    return {
      errors: {
        email: 'Check your email',
        password: 'Check your password',
      },
      isSuccess: false,
      email: trimmedEmail,
    };
  }
}
