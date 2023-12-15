import { apiCaller } from "./apiCaller";

export const dangNhap = (user) => {
  return apiCaller("TaiKhoan/DangNhap", "POST", user);
};

export const dangKy = (user) => {
  return apiCaller("TaiKhoan/TaoTaiKhoan", "POST", user);
};
