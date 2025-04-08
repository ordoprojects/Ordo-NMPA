import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import globalStyles from "../../styles/globalStyles";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 5,
    ...globalStyles.border,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 16,
    color: "#000",
    textTransform: "capitalize",
    fontFamily: "AvenirNextCyr-Medium",
  },
  sendIcon: {
    height: 24,
    width: 24,
    tintColor: "#176ce8",
    marginRight: 20,
    marginBottom: 10,
    tintColor: Colors.primary,
  },
  docIcon: {
    height: 24,
    width: 24,
    marginRight: 16,
    color: Colors.black,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatFooter: {
    shadowColor: "#1F2687",
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    padding: 5,
   
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderColor: "black",
    right: 3,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  textFooterChat: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
    color: "black",
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: "gray",
    marginLeft: 2,
  },
  send: {
    color: Colors.primary,
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    marginLeft: 5,
  },
  inputToolbarContainer: {
    // borderTopWidth: 1,
    // borderTopColor: "#ccc",
    // borderWidth: 1,
    // borderColor: "#ddd",
    // borderRadius:17,
    // marginHorizontal:'2%',
    // marginBottom:'1%',
  
  },
  primaryStyle: {
    // alignItems: "center",
  },
  inputContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  textInput: {
    // flex: 1,
    // height: 40,
    // paddingHorizontal: 10,
    // borderRadius: 20,
    // backgroundColor: "#f2f2f2",
    // color: "#333",
    // fontSize: 16,
    // borderWidth: 1,
    // borderColor: "#ccc",
  }
  
});
