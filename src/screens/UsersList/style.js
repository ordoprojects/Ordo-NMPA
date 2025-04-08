import { StyleSheet } from "react-native";
import { CollapsedItem } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import Colors from "../../constants/Colors";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 5,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  HeaderText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "AvenirNextCyr-Medium",
  },
  flatViewcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 0.8,
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    flex: 1,
    // marginTop:'3%'
  },
  imgStyle: {
    height: 58,
    width: 58,
    borderRadius: 50,
    resizeMode:'contain',
    // borderColor:Colors.primary,
    // borderWidth:2
  },
  name: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
    color:Colors.primary
  },
  msg: {
    fontSize: 15,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    flex:1
  },
  unreadContainer: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: '#50C878',
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
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
