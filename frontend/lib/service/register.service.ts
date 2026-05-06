import { api } from '../api';
import type { RegisterInput } from '../../src/types/regis';
import type { ApiResponse } from '../../src/types/api';
import type { User } from '../../src/types/user';

export const registerUser = async (
  data: RegisterInput
): Promise<ApiResponse<User>> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};