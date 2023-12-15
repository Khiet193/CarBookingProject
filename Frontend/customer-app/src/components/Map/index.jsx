import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Button,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  INTERVAL_TIME,
  LOAI_TAI_KHOAN,
  TK_INFO,
  GOOGLE_DIRECTION_API_KEY,
} from "../../constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { makeHubConnection } from "../../api/apiCaller";
import { getValueFor } from "../../utils/storage";
import { styles, autoCompleteStyles } from "./style";
import { AppContext } from "../../context/AppContext";
import { taoDonHang } from "../../api/booking";

let timeoutClearBooking;

const initialBooking = {
  diemDon: "",
  diemDen: "",
};

const MapScreen = () => {
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const { currentUser } = useContext(AppContext);
  // console.log("MapScreen", currentUser);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [driver, setDriver] = useState({});
  const [customer, setCustomer] = useState({});
  const [open, setOpenModal] = useState(false);
  const [booking, setBooking] = useState(initialBooking);

  useEffect(() => {
    getLocationAsync();
    connectSocket();
  }, []);

  const connectSocket = async () => {
    try {
      let connection = await makeHubConnection();
      await connection.start();
      await connection.send("SendMessage", "Khach Hang nhan cuoc xe.");
      connection.onclose(() => {
        console.log("xxxx");
      });
      connection.on("ReceiveMessage", async (bookingData) => {
        if (bookingData) {
          const bookingInfo = await JSON.parse(bookingData);
          if (
            bookingInfo &&
            bookingInfo.DiemDen &&
            bookingInfo.SoDienThoaiKhachHang == currentUser.soDienThoai &&
            bookingInfo.TrangThai == 2
          ) {
            console.log("SignalR Booking", bookingInfo);
            setBooking({
              ...booking,
              ...bookingInfo,
            });
            setOpenModal(true);
          }
        }
      });
      connection.on("close", () => {
        console.log("onclose", error);
      });
      connection.onclose((error) => {
        connectSocket();
        console.log("onclose", error);
      });
    } catch (error) {
      console.error("connectSocket", error);
    }
  };

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const loginUserInfo = await getValueFor(TK_INFO);
      const userInfo = await JSON.parse(loginUserInfo);
      // console.log("getuserInfoAsync", userInfo);
      setCurrentLocation({ latitude, longitude });
      setCustomer({ ...userInfo, latitude, longitude });
    } catch (error) {
      console.log("getLocationAsync", error);
    }
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

  const _handleSaveLocation = (data, details = null) => {
    console.log("_handleSaveLocation", details);
    if (details) {
      const diemDenLocation = {
        longitude: details?.geometry?.location.lng,
        latitude: details?.geometry?.location.lat,
        place_name: details.formatted_address,
      };
      setBooking(diemDenLocation);
    }
  };

  const _handleBooking = async () => {
    try {
      const bookingInfo = {
        soDienThoaiKhachHang: customer.soDienThoai,
        tenKhachHang: customer.hoTen,
        diemDon: "Vi tri hien tai",
        diemDen: booking?.place_name,
        longitudeDiemDen: booking.longitude,
        latitudeDiemDen: booking?.latitude,

        longitudeDiemDen: booking.longitude,
        latitudeDiemDen: booking?.latitude,
        longitudeKhachHang: currentLocation.longitude,
        latitudeKhachHang: currentLocation.latitude,

        longitudeKhachHang: currentLocation.longitude, //106.76271152003179, //
        latitudeKhachHang: currentLocation.latitude, //10.7745065331476, //
        loaiKhachHang: LOAI_TAI_KHOAN.KHACH_HANG,
        thoiGianDon: new Date().toISOString(),
        gioDatXe: new Date().toISOString(),
      };

      if (bookingInfo?.diemDen && bookingInfo?.diemDen.length > 0) {
        autoCompleteRef?.current?.clear();
        const donhang = await taoDonHang(bookingInfo);
      }
    } catch (error) {
      console.error("_handleBooking", error);
    } finally {
    }
  };

  const _handleAcceptBooking = () => {
    if (timeoutClearBooking) clearTimeout(timeoutClearBooking);
    timeoutClearBooking = setTimeout(() => {
      setBooking({
        ...initialBooking,
      });
    }, 20000);
    setOpenModal(false);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} onMapReady={handleMapReady}>
        <Marker
          key={customer.id}
          coordinate={{
            latitude: customer.latitude,
            longitude: customer.longitude,
          }}
          title={"Khách hàng"}
          pinColor="blue"
        >
          <Image
            source={require("../../../assets/icons/customer.png")}
            style={styles.markerIcon}
          />
        </Marker>
        {booking && booking.LatitudeTaiXe && booking.LongitudeTaiXe && (
          <Marker
            key={"driver"}
            coordinate={{
              latitude: booking.LatitudeTaiXe,
              longitude: booking.LongitudeTaiXe,
            }}
            title={"Tài Xế"}
            pinColor="blue"
          >
            <Image
              source={require("../../../assets/icons/driver.png")}
              style={styles.markerIcon}
            />
          </Marker>
        )}
        {booking && booking.LatitudeDiemDen && booking.LongitudeDiemDen && (
          <Marker
            key={"destination"}
            coordinate={{
              latitude: booking.LatitudeDiemDen,
              longitude: booking.LongitudeDiemDen,
            }}
            title={"DiemDen"}
            pinColor="blue"
          >
            <Image
              source={require("../../../assets/icons/ic-destination.png")}
              style={styles.markerIcon}
            />
          </Marker>
        )}
        {booking &&
          booking.LatitudeDiemDen &&
          booking.LongitudeDiemDen &&
          booking.TrangThai == 2 && (
            <Polyline // dẫn đường
              coordinates={[
                {
                  latitude: customer.latitude,
                  longitude: customer.longitude,
                },
                {
                  latitude: booking.LatitudeDiemDen,
                  longitude: booking.LongitudeDiemDen,
                },
              ]}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          )}
      </MapView>
      <View style={styles.safeView}>
        <View style={styles.containerSafeView}>
          <View style={styles.inputForm}>
            <View style={styles.inputField}>
              <View style={styles.label}>
                <Text>{"Từ"} </Text>
              </View>
              <View style={styles.inputText}>
                <Text>{`Current Location`}</Text>
              </View>
            </View>
          </View>
          <View style={{ zIndex: 200 }}>
            <View style={styles.inputField}>
              <View style={styles.label}>
                <Text>{`Đến`}</Text>
              </View>
              <View style={styles.inputTextAutoComplete}>
                <GooglePlacesAutocomplete
                  ref={autoCompleteRef}
                  timeout={500}
                  placeholder="Nhập điểm đến"
                  styles={autoCompleteStyles}
                  onPress={_handleSaveLocation}
                  googleplacesdetailsquery={{ fields: "geometry" }}
                  query={{
                    key: GOOGLE_DIRECTION_API_KEY,
                  }}
                  fetchDetails={true}
                  onFail={(error) => console.log(error)}
                  onNotFound={() => console.log("no results")}
                />
              </View>
            </View>
          </View>
          <View style={{ zIndex: 1 }}>
            <Button disabled={!booking} title="Book" onPress={_handleBooking} />
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.buttonBook}
          onPress={handleFocusOnLocation}
        >
          <Text style={styles.buttonText}>Đặt xe</Text>
        </TouchableOpacity>
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
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          // setModalVisible(!modalVisible);
        }}
      >
        {booking && booking.TrangThai == 2 && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <View>
                  <Text style={styles.title}>Đặt xe thành công!</Text>
                </View>
                <View>
                  {booking.TrangThai == 2 &&
                    booking.TenTaiXe &&
                    booking.SoDienThoaiTaiXe &&
                    booking.BienSoXe && (
                      <View>
                        {booking?.TenTaiXe && (
                          <Text
                            style={styles.title}
                          >{`Tài xế ${booking?.TenTaiXe}`}</Text>
                        )}
                        {booking?.SoDienThoaiTaiXe && (
                          <Text
                            style={styles.title}
                          >{`Số điện thoại ${booking?.SoDienThoaiTaiXe}`}</Text>
                        )}
                        {booking?.BienSoXe && (
                          <Text
                            style={styles.title}
                          >{`Biển số xe ${booking?.BienSoXe}`}</Text>
                        )}
                      </View>
                    )}
                </View>
                <View style={styles.groupButton}>
                  <Pressable
                    style={styles.buttonAccept}
                    onPress={_handleAcceptBooking}
                  >
                    <Text style={styles.actionButtonStyle}>{"Xác nhận"}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default MapScreen;
