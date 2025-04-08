import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 5,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 5,
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
  },
  flatViewcontainer: {
    flexDirection: "row",
    borderBottomColor: "#F5F6F6",
    borderBottomWidth: 0.8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    paddingBottom:'4%',
    paddingRight:'5%'
  },
  imgStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 16,
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
    textTransform: "capitalize",
  },
  msg: {
    fontSize: 15,
  },
  sectionHeader: {
    paddingLeft: "4%",
    backgroundColor: "#F3F6F6",
  },
  sectionHeaderText: {
    fontSize: 25,
    fontFamily: "AvenirNextCyr-Medium",
    marginRight: "4%",
    color: Colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "4%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: "4%",
  },
  headerText: {
    fontFamily: "AvenirNextCyr-Bold",
    fontSize: 19,
    color: "white",
    marginRight: "4%",
  },
  searchbar: {
    marginHorizontal: "4%",
    backgroundColor: "#F3F3F3",
    fontFamily: "AvenirNextCyr-Thin",
    height: 50,
  },
  whiteView: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "1%",
  
  },
});
