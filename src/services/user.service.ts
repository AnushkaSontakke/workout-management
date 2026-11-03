import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../dal/user.dal';
import { findUserByPassword } from '../dal/user.dal';
import { generateToken } from '../utils/jwt';

interface LoginUserData {
  email: string;
  password: string;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passKey: string;
}

export const registerUserService = async (userData: RegisterUserData) => {
  const { firstName, lastName, email, password, passKey } = userData;

  const existingUser = await findUserByEmail(email.toLowerCase());

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedPasskey = await bcrypt.hash(passKey, 12);

  const user = await createUser({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    passKey: hashedPasskey,
  });

  return user;
};
export const loginUserService = async (userData: LoginUserData) => {
  const { email, password } = userData;

  const user = await findUserByPassword(email.toLowerCase());

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};
