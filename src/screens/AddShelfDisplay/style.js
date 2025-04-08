import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
export default StyleSheet.create({
  headercontainer: {
    padding: 10,
    //backgroundColor:'red',
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 0.9,
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
  },

  buttonview: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonContainer: {
    height: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  photosContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "white",
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: "black",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
  },
  text: {
    fontFamily: "AvenirNextCyr-Medium",
  },
  imgStyle: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  dropDownContainer: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  title: {
    marginVertical: 10,
    paddingHorizontal: 36,
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: "black",
  },
  contentView: {
    color: "black",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Medium",
    //fontStyle:'italic'
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: 3,
  },
  cNameTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#B3B6B7",
    padding: 5,
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  
});
