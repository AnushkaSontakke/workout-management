import User from '../models/user';
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passKey: string;
}) => {
  return await User.create(userData);
};
export const findUserByPassword = async (email: string) => {
  return await User.findOne({ email }).select('+password');
};
export const findUserByPassKey = async (email: string) => {
  return await User.findOne({ email }).select('+passKey');
};

export const updateUserPassword = async (
  userId: string,
  hashedPassword: string,
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
    },
    { returnDocument: 'after', runValidators: true },
  );
};
