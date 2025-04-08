import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { AuthContext } from "../../Context/AuthContext";
import { Callout } from "@rnmapbox/maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../../constants/Colors";

const LiveLocation = ({ navigation, route }) => {
  const orderDetails = route.params?.orderDetails;
  console.log("🚀 ~ LiveLocation ~ orderDetails-----------------------:", orderDetails)

  
  const [salesmanData, setSalesmanData] = useState([]);
  const [truckLocations, setTruckLocations] = useState([]);

  const { token, userData } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);


  console.log('location--------->',orderDetails)


  useEffect(() => {
    // Initialize an empty array to store latitude and longitude values
    const validLocations = [];


    if (orderDetails.latitude !== null && orderDetails.longitude !== null) {
      // Push the valid latitude and longitude values into the validLocations array
      validLocations.push({
        id: orderDetails.id,
        assignee_name: orderDetails.assignee_name,
        assigne_to: orderDetails.assigne_to,
        name: orderDetails.name,
        location: orderDetails.location,
        latitude: orderDetails.latitude,
        longitude: orderDetails.longitude
      });
    }


    // Do something with the validLocations array (e.g., set state or perform further processing)
    setLocations(validLocations)

    // Iterate through the data and filter out objects with non-null latitude and longitude values



  }, [orderDetails]);

  const fetchLocation = async () => {
    try {
      const response = await fetch("https://gsidev.ordosolution.com/api/location", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      const result = await response.json();
      setLocations(result);
      console.log(result);

    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30, tintColor: Colors.primary }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            color: Colors.primary,
            fontFamily: "AvenirNextCyr-Medium",
            marginVertical: 5,
          }}
        >
          Locate Orders
        </Text>
        <Text />
      </View>

      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera zoomLevel={11} centerCoordinate={[74.8592, 12.8805]} />

        {locations.map((locationItem) => (
          <MapboxGL.PointAnnotation
            onSelected={() => {
              console.log("navigate to activities page")
              navigation.navigate("TrackingDetails", { orderDetails: orderDetails });
            }}
            key={locationItem.id}
            id={locationItem.id.toString()}
            coordinate={[
              parseFloat(locationItem.longitude), 
              parseFloat(locationItem.latitude)  
            ]}
          >
            <View style={{ alignItems: 'center', }}>
              <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: '4%' }}>
                <Text>
                  {locationItem.name} ({locationItem.assignee_name}-{locationItem.assigne_to})
                </Text>
                <Text>
                  {locationItem.location}
                </Text>
              </View>
              <View
                onPress={() => { console.log("pressed") }}
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: 'white',
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 3,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} >
                <FontAwesome name="truck" color={"black"} size={25} />
              </View>

            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
};

export default LiveLocation;
