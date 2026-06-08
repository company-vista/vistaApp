import Toast from 'react-native-toast-message';

export type SignupErrors = {
  name?: string;
  email?: string;
  password?: string;
};

type SignupApiParams = {
  name: string;
  email: string;
  password: string;
};

type SignupApiResult = {
  errors: SignupErrors;
  isSuccess: boolean;
  email: string;
  name: string;
};

const TEMP_SIGNUP_ROUTE = '/api/auth/signup';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export async function handleSignupApi({
  name,
  email,
  password,
}: SignupApiParams): Promise<SignupApiResult> {
  const errors: SignupErrors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    errors.name = 'Full name is required';
  } else if (trimmedName.length < 2) {
    errors.name = 'Full name is too short';
  }

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
      text1: 'Signup failed',
      text2: 'Please check your details.',
    });

    return {
      errors,
      isSuccess: false,
      email: trimmedEmail,
      name: trimmedName,
    };
  }

  await wait(600);

  Toast.show({
    type: 'success',
    text1: 'Account created',
    text2: `Created from ${TEMP_SIGNUP_ROUTE}. Please login.`,
  });

  return {
    errors,
    isSuccess: true,
    email: trimmedEmail,
    name: trimmedName,
  };
}
