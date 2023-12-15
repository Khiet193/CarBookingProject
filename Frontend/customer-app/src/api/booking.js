import { apiCaller } from "./apiCaller";

export const taoDonHang = (booking) => {
  return apiCaller("/DonHang/TaoDonHang", "POST", booking);
};

export const dangKy = (user) => {
  return apiCaller("TaiKhoan/TaoTaiKhoan", "POST", user);
};
