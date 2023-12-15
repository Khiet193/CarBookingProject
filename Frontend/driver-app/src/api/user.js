import { apiCaller } from "./api";
import { LOAI_TAI_KHOAN } from "../constants";

export const dangKy = (user) => {
  return apiCaller("TaiKhoan/TaoTaiKhoan", "POST", user);
};
export const dangNhap = (user) => {
  return apiCaller("TaiKhoan/DangNhap", "POST", {
    ...user,
    loaiTaiKhoan: LOAI_TAI_KHOAN.TAI_XE,
  });
};
