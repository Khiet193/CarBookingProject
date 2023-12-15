import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { INTERVAL_TIME, DRIVER_STATE } from "../../constants";

import * as Location from "expo-location";
import { styles } from "./style";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { makeHubConnection } from "../../api/api";
import { getValueFor } from "../../utils/storage";
import {
  capNhatViTri,
  chapNhanDonHang,
  hoangThanhCuocXe,
  tuChoiDonHang,
} from "../../api/taixe";
import { AppContext } from "../../context/AppContext";

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AppContext);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [driver, setDriver] = useState({
    state: DRIVER_STATE.ACTIVE,
    latitudeTaiXe: 0,
    longitudeTaiXe: 0,
  });
  const [customer, setCustomer] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [booking, setBooking] = useState({});

  // todo socket
  useEffect(() => {
    getLocationAsync();
    connectSocket();
  }, []);

  const connectSocket = async () => {
    try {
      const connection = await makeHubConnection();
      await connection.start();
      await connection.send("SendMessage", "Tai xe nhan cuoc xe.");

      connection.on("ReceiveMessage", async (bookingData) => {
        console.log("SignalR Data Return", JSON.parse(bookingData));
        if (bookingData) {
          if (bookingData.soDienThoaiTaiXe === driver.soDienThoaiTaiXe) {
            console.log("Kiem tra tai xe nhan cuoc xe", bookingData);
            console.log(typeof bookingData);
            bookingData = await JSON.parse(bookingData);
            setBooking({
              soDienThoaiKhachHang: bookingData?.SoDienThoaiKhachHang,
              tenKhachHang: bookingData.TenKhachHang,
              diemDon: bookingData.DiemDon, // "Thảo Điền Pearl",
              diemDen: bookingData.DiemDen, // "Khu biệt thự Eden Thảo Điền",
              thoiGianDon: bookingData.ThoiGianDon,
              gioDatXe: bookingData.GioDatXe,
              giaTien: bookingData.ThoiGianDon,
              tenTaiXe: bookingData.TenTaiXe,
              soDienThoaiTaiXe: bookingData.SoDienThoaiTaiXe,
              bienSoXe: bookingData.BienSoXe,
              trangThai: bookingData.TrangThai,
              longitudeDiemDen: bookingData.LongitudeDiemDen,
              latitudeDiemDen: bookingData.LatitudeDiemDen,
              // longitudeKhachHang: bookingData.LongitudeDiemDen,
              // latitudeKhachHang: bookingData.LatitudeDiemDen,
              longitudeKhachHang: bookingData.LongitudeKhachHang,
              latitudeKhachHang: bookingData.LatitudeKhachHang,
              ...bookingData,
            });
            setModalVisible(true);
          }
        }
      });
      connection.onclose((error) => {
        // initializeConnection();
        console.log("onclose", error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalLocation = setInterval(() => {
      trackingLocation();
    }, INTERVAL_TIME);

    return () => {
      if (intervalLocation) clearInterval(intervalLocation);
    };
  }, []);

  const trackingLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const driver = {
        soDienThoaiTaiXe: currentUser.soDienThoai,
        longitudeTaiXe: longitude,
        latitudeTaiXe: latitude,
      };
      // console.log("Lay thong tin tai xe", driver);
      const result = await capNhatViTri(driver);
    } catch (error) {
      console.log("Cap nhat vi tri", error);
    }
  };

  const getLocationAsync = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    // console.log("Lay thong tin tai xe", JSON.parse(info));
    setDriver({
      ...currentUser,
      latitude,
      longitude,
      state: DRIVER_STATE.ACTIVE,
    });
    setCurrentLocation({ latitude, longitude });
  };

  const handleFocusOnLocation = () => {
    if (currentLocation) {
      // Focus on the current location using the map's animateToRegion method
      const { latitude, longitude } = currentLocation;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleMapReady = () => {
    handleFocusOnLocation();
  };

  const _handleAccept = async () => {
    console.log("_handleAccept", driver);
    setDriver({
      ...driver,
      state: DRIVER_STATE.ON_BOOKING,
    });
    setLoading(true);
    setModalVisible(!modalVisible);
    try {
      await chapNhanDonHang(driver);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const _handleCancle = async () => {
    try {
      setDriver({
        ...driver,
        state: DRIVER_STATE.ACTIVE,
      });
      setLoading(true);
      const result = await tuChoiDonHang(driver);
    } catch (error) {
      console.error("tuChoiDonHang", error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  // const GOOGLE_MAPS_APIKEY = "";
  const GOOGLE_MAPS_APIKEY = "";

  console.log(booking.latitudeKhachHang, booking.longitudeKhachHang);

  const _handleDropCustomer = async () => {
    try {
      await hoangThanhCuocXe(booking);
      setDriver({
        ...driver,
        state: DRIVER_STATE.ACTIVE,
      });
      setBooking({});
    } catch (error) {
      console.log("Hoang thanh cuoc xe", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} onMapReady={handleMapReady}>
        <Marker // driver
          key={driver.id}
          coordinate={{
            latitude: driver.latitude,
            longitude: driver.longitude,
          }}
          title={driver.hoTen}
          pinColor="green"
        >
          <Image
            source={require("../../../assets/icons/driver.png")}
            style={styles.markerIcon}
          />
        </Marker>
        {driver.state == DRIVER_STATE.ON_BOOKING &&
          booking.soDienThoaiKhachHang && (
            <Marker // khach hang
              key={booking.soDienThoaiKhachHang}
              coordinate={{
                latitude: booking.LatitudeKhachHang,
                longitude: booking.LongitudeKhachHang,
              }}
              title={booking.tenKhachHang}
              pinColor="blue"
            >
              <Image
                source={require("../../../assets/icons/customer.png")}
                style={styles.markerIcon}
              />
            </Marker>
          )}
        {driver.state == DRIVER_STATE.ON_BOOKING && (
          <Marker // Diemden
            key={booking.DiemDen}
            coordinate={{
              latitude: booking.LatitudeDiemDen,
              longitude: booking.LongitudeDiemDen,
            }}
            title={booking.DiemDen}
            pinColor="blue"
          >
            <Image
              source={require("../../../assets/icons/ic-destination.png")}
              style={styles.markerIcon}
            />
          </Marker>
        )}
        {driver.state == DRIVER_STATE.ON_BOOKING && (
          <Polyline // dẫn đường
            coordinates={[
              {
                latitude: booking.LatitudeKhachHang,
                longitude: booking.LongitudeKhachHang,
              },
              {
                latitude: booking.latitudeDiemDen,
                longitude: booking.longitudeDiemDen,
              },
            ]}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
        {driver.state == DRIVER_STATE.ON_BOOKING && (
          <Polyline
            coordinates={[
              {
                latitude: driver.latitude,
                longitude: driver.longitude,
              },
              {
                latitude: booking.LatitudeKhachHang,
                longitude: booking.LongitudeKhachHang,
              },
            ]}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.buttonFocus}
        onPress={handleFocusOnLocation}
      >
        <Text style={styles.buttonText}>
          <Image
            source={require("../../../assets/icons/ic-focus.png")}
            style={styles.markerIcon}
          />
        </Text>
      </TouchableOpacity>
      {driver.state == DRIVER_STATE.ON_BOOKING && (
        <TouchableOpacity style={styles.button} onPress={_handleDropCustomer}>
          <Text style={styles.buttonText}>Hoàn Thành Chuyến Đi</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.title}>Thông Báo Chuyến Xe</Text>
              </View>
              <View style={styles.diemDon}>
                <Text style={styles.textTitle}>Điểm đón</Text>
                <Text>{booking.diemDon}</Text>
              </View>
              <View style={styles.diemDen}>
                <Text style={styles.textTitle}>Điểm đến</Text>
                <Text>{booking.diemDen}</Text>
              </View>
              <View style={styles.groupButton}>
                <Pressable onPress={_handleAccept}>
                  <View style={styles.buttonAccept}>
                    <Text style={styles.actionButtonStyle}>Xác nhận</Text>
                  </View>
                </Pressable>
                <Pressable style={styles.buttonCancel} onPress={_handleCancle}>
                  <Text style={styles.actionButtonStyle}>Hủy</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;
