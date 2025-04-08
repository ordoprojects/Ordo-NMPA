import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Colors from "../../constants/Colors";
import { AuthContext } from "../../Context/AuthContext";

const BottomSheetComponent = ({ navigation, closeBottomSheet, bottomSheetModalRef }) => {
  const { userData } = useContext(AuthContext);

  console.log("Received App Config:----------------->", userData?.app_config);

  const defaultConfig = {
    Supplier: 1,
    Inventory: 1,
    Order: 1,
    Sales: 1,
    Fleet: 1,
    Financial: 1,
    User: 1,
    Production: 1
  };

  // Function to check if the app_config contains all required keys
  const isValidConfig = (config) => {
    const requiredKeys = ['Supplier', 'Inventory', 'Order', 'Sales', 'Fleet', 'Financial', 'User', 'Production'];
    return requiredKeys.every(key => key in config);
  };

  // Fetch app_config from userData, falling back to defaultConfig if necessary
  const appConfig = userData?.app_config;

  console.log('===============appConfig=====================');
  console.log(appConfig);
  console.log('=============================================');

  const config = appConfig && isValidConfig(appConfig) ? appConfig : defaultConfig;

  console.log('===============Config========================');
  console.log(config);
  console.log('=============================================');

  const menuItems = [
    { key: 'Supplier', label: 'Supplier\nManagement', image: require("../../assets/images/SuppMgmt.png"), screen: "SuppMangHome" },
    { key: 'Inventory', label: 'Inventory\nManagement', image: require("../../assets/images/InvtryMgmt.png"), screen: "InvtryMangHome" },
    { key: 'Order', label: 'Order\nManagement', image: require("../../assets/images/OrderMgmt.png"), screen: "OrderMangHome" },
    { key: 'Sales', label: 'Sales\nManagement', image: require("../../assets/images/SalesMgmt.png"), screen: "Visits" },
    { key: 'Fleet', label: 'Fleet\nManagement', image: require("../../assets/images/FleetMgmt.png"), screen: "FleetMangHome" },
    { key: 'Financial', label: 'Financial\nManagement', image: require("../../assets/images/FinclMgmt.png"), screen: "FinMangHome" },
    { key: 'Production', label: 'Production\nManagement', image: require("../../assets/images/FinclMgmt.png"), screen: "ProductionMgmt" },
  ].filter(item => config[item.key] === 1); // Ensure only items with config value 1 are included

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.recoredbuttonStyle}
        onPress={() => {
          navigation.navigate(item.screen);
          closeBottomSheet();
        }}
      >
        <Image
          source={item.image}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
      <Text style={styles.textStyle}>{item.label}</Text>
    </View>
  );


  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={[320, 320]}
      index={0}
      zIndex={100}
    >
      <BottomSheetScrollView backgroundColor={Colors.primary}>
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            numColumns={3}
            contentContainerStyle={styles.grid}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default BottomSheetComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  grid: {
    justifyContent: 'center'
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%'
  },
  recoredbuttonStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    height: 90,
    width: 110,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontSize: 12,
    marginTop: "2%",
    textAlign: "center",
    fontFamily: "AvenirNextCyr-Medium",
  },
  iconStyle: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    alignSelf: "center",
  },
});
