import { apiCaller } from "./api";

export const chapNhanDonHang = (driver) => {
  return apiCaller("/TaiXe/ChapNhanDonHang", "POST", driver);
};

export const tuChoiDonHang = (driver) => {
  return apiCaller("/TaiXe/TuChoiDonHang", "POST", driver);
};

export const capNhatViTri = (driver) => {
  return apiCaller("/TaiXe/CapNhatViTri", "POST", driver);
};

export const hoangThanhCuocXe = (booking) => {
  return apiCaller("/TaiXe/TaiXeHoanThanhChuyenDi", "POST", booking);
};
