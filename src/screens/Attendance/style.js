import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import globalStyles from "../../styles/globalStyles";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    marginHorizontal: '5%'
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
  nameText: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium',
    textTransform: "capitalize",
  },
  dateText: {
    //color:Colors.grey,
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  title: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginTop: 10,
    marginLeft: '5%'
  },
  attendanceView: {
    marginVertical: 10,
    borderRadius: 8,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 10,
    flexDirection: "row",
    backgroundColor: "#F4F5FA",
    paddingHorizontal: 20,
    paddingVertical: '3%',
    marginHorizontal:'2%'


  },

  dateViewContainer: {
    marginRight: 12,
  },
  dateValStyle: {
    fontSize: 20,
    color: Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  month: {
    color: Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  weekNameTextStyle: {
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 14,
    color: Colors.black,
  },
  place: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: 'AvenirNextCyr-Medium',
    color: "#5A5A5A",
  },
  clockInContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 5,
    ...globalStyles.border,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    marginHorizontal: '5%',
    marginVertical: '5%'
  },
  buttonStyle: {
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 19,
    color: Colors.black,
    fontFamily: 'AvenirNextCyr-Medium',
    marginVertical: 10,
    textAlign: 'center',
    alignItems: 'center'
  },
  buttonTextStyle: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  name: {
    fontSize: 14,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
  },
  filterButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the modal content horizontally
  },

  closeIcon: {
    position: "absolute",
    top: 0, // Set the top offset to 0 (right above the modal content)
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 15, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: "#000000",
    textAlign: "left",
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    marginLeft: 1,
  },
  container1: {
    backgroundColor: "white",
    padding: 16,
    width: "100%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
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
    fontFamily: 'AvenirNextCyr-Medium',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'AvenirNextCyr-Medium',
  },
});
