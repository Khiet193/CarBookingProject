import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  safeView: {
    position: "absolute",
    top: 12,
    right: 16,
    left: 16,
    backgroundColor: "transparent",
  },
  containerSafeView: {
    width: "100%",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 12,
    position: "relative",
  },
  inputForm: {},
  inputField: {
    flexDirection: "row",
    padding: 12,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  inputTextAutoComplete: {
    position: "relative",
    flex: 1,
    height: 48,
    padding: 0,
    // height: 48,
    // borderWidth: 1,
    // borderRadius: 4,
    // paddingLeft: 12,
    // alignItems: "flex-start",
    // justifyContent: "center",
  },
  label: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export const autoCompleteStyles = StyleSheet.create({
  container: {
    zIndex: 9999,
    position: "absolute",
    width: "100%",

    // backgroundColor: "blue",
  },
  description: {},
  textInputContainer: {},
  textInput: {
    // minHeight: 40,
    // backgroundColor: "blue",
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
  },
  loader: {},
  listView: {
    borderWidth: 1,
    borderRadius: 4,
  },
  predefinedPlacesDescription: {},
  poweredContainer: {},
  powered: {},
  separator: {},
  row: {},
});
