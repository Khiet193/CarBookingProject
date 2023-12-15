import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerIcon: {
    width: 24,
    height: 24,
  },
  button: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  textTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  groupButton: {
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 4,
  },
  buttonAccept: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "green",
  },
  buttonCancel: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "red",
  },
  actionButtonStyle: {
    color: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  diemDen: {
    marginTop: 12,
  },
  diemDon: {
    backgroundColor: "#baf3db",
    padding: 12,
    borderRadius: 8,
  },
  diemDen: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "lightblue",
    marginTop: 12,
  },
  buttonFocus: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    right: 16,
    bottom: 160,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});
