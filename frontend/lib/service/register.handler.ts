import { registerUser } from "./register.service";

type RegisterInput = {
  nama: string;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  code: string;
};

export const handleRegister = async (data: RegisterInput) => {
  // VALIDASI PASSWORD
  if (data.password !== data.confirm) {
    throw new Error("Password tidak sama");
  }

  // MAPPING KE API FORMAT
  return registerUser({
    nama: data.nama,
    email: data.email,
    password: data.password,
    no_hp: data.code + data.phone,
  });
};