import { apiCaller } from "./apiCaller";

export const datXe = (booking) => {
  return apiCaller("/DonHang/TaoDonHang", "POST", booking);
};

export const huyXe = (book) => {};
