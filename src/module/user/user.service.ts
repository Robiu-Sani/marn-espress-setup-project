import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { userInterface } from './user.interface';
import User from './user.model';

/**
 * Create a new user
 */
export const createUser = async (userData: Partial<userInterface>) => {
  const user = await User.create(userData);
  return user;
};

/**
 * Get all users with Search, Filter (Role, Gender, Status), and Pagination
 */
export const getAllUsers = async (queryObj: {
  search?: string;
  page?: number;
  limit?: number;
  gender?: string;
  role?: string;
  status?: string;
  isDeleted?: boolean;
}) => {
  const {
    search = '',
    page = 1,
    limit = 50,
    gender,
    role,
    status,
    isDeleted = false,
  } = queryObj;

  const query: FilterQuery<userInterface> = { isDeleted };

  // 1. Search Logic (Search by Name or Email)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { number: { $regex: search, $options: 'i' } },
    ];
  }

  // 2. Filter Logic
  if (gender) query.gender = gender;
  if (role) query.role = role;
  if (status) query.status = status;

  // 3. Execution
  const skip = (Number(page) - 1) * Number(limit);
  
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .exec();

  const total = await User.countDocuments(query);

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: users,
  };
};

/**
 * Get a single user by ID
 */
export const getSingleUser = async (id: string) => {
  const user = await User.findById(id).exec();
  return user;
};

/**
 * Update a single user
 */
export const updateSingleUser = async (
  id: string,
  updateData: UpdateQuery<userInterface>,
) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return user;
};

/**
 * Soft delete a single user
 */
export const deleteSingleUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).exec();
  return user;
};

/**
 * Bulk update user roles
 */
export const updateManyUsersRole = async (
  ids: Types.ObjectId[] | string[],
  role: string,
) => {
  const result = await User.updateMany(
    { _id: { $in: ids } },
    { role },
    { runValidators: true }
  ).exec();
  return result;
};

/**
 * Bulk update user status
 */
export const updateManyUsersStatus = async (
  ids: Types.ObjectId[] | string[],
  status: string,
) => {
  const result = await User.updateMany(
    { _id: { $in: ids } },
    { status },
    { runValidators: true }
  ).exec();
  return result;
};

/**
 * Bulk soft delete or restore users
 */
export const updateManyUsersIsDeleted = async (
  ids: Types.ObjectId[] | string[],
  isDeleted: boolean,
) => {
  const result = await User.updateMany(
    { _id: { $in: ids } },
    { isDeleted },
  ).exec();
  return result;
};