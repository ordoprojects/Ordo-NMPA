import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import React, { useState, useContext, useEffect } from "react";
import Octicons from "react-native-vector-icons/Octicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-simple-toast";

const DriverNotification = ({ navigation, route }) => {
  const { DriverID } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      GetDriverNotification();
    }, [])
  );

  const GetDriverNotification = async () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://gsidev.ordosolution.com/api/driver_notifications/?driver_id=${DriverID}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        if (result.error) {
          console.log("Error getting Notification");
        } else {

          const sortedData = result[0]?.notification_status.sort((a, b) => {
            const dateA = new Date(a.status_changed_time);
            const dateB = new Date(b.status_changed_time);
            return dateB - dateA;
          });

          setNotifications(sortedData || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error getting History", error);
      });
  };

  const MarkAllAsRead = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    const ids = notifications
    .filter(notification => !notification?.is_read)
    .map(notification => notification?.msg_id);

    var raw = JSON.stringify({
      msg_ids: ids,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/mark_notification_as_read/",
        requestOptions
      );
      const result = await response.json();
      GetDriverNotification();
      Toast.show("All Notifications marked as read successfully", Toast.LONG);
    } catch (error) {
      console.log("error", error);
    }
  };

  const NotificationRead = async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData?.token}`);

    var raw = JSON.stringify({
      msg_ids: [id],
    });

    console.log("raw", raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/mark_notification_as_read/",
        requestOptions
      );
      const result = await response.json();
      GetDriverNotification();
      Toast.show("Notifications marked as read successfully", Toast.LONG);
      console.log("Updated Succesfully :", result);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <LinearGradient
      colors={Colors.linearColors}
      start={Colors.start}
      end={Colors.end}
      locations={Colors.location}
      style={{ flex: 1 }}
    >
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: "4%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification</Text>
        <TouchableOpacity style={styles.readAllButton} onPress={MarkAllAsRead}>
          <Text style={styles.readAllText}>Read All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.whiteView}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ justifyContent: "center", alignItems: "center" }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              marginHorizontal: "4%",
              marginVertical: "4%",
              paddingRight:'3%',
              flex:1
            }}
          >
            <FlatList
              data={notifications}
              style={{ marginHorizontal: "3%", marginTop: "4%" }}
              keyExtractor={(item) =>
                item.id ? item.id.toString() : Math.random().toString()
              }
              ListEmptyComponent={() => (
                <View style={{alignItems:'center',justifyContent:'center',marginTop:'70%'}}>
                  <Text style={{color:'gray',alignItems:'center'}}>No Notifications</Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.notificationItem}
                  onPress={() => {
                    if (item?.is_read) {
                      NotificationRead(item?.msg_id);
                    }
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 15,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor:
                          item.message === "Route Created"
                            ? "#4169E1"
                            : item.message === "In Transit"
                            ? "#FFC300"
                            : item.message === "Completed"
                            ? "#50C878"
                            : "gray",
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 4,
                      }}
                    >
                      {item.message === "Route Created" ? (
                        <MaterialCommunityIcons
                          name="tanker-truck"
                          color={`white`}
                          size={30}
                        />
                      ) : item.message === "In Transit" ? (
                        <MaterialCommunityIcons
                          name="truck-fast-outline"
                          color={`white`}
                          size={30}
                        />
                      ) : item.message === "Completed" ? (
                        <MaterialCommunityIcons
                          name="truck-check-outline"
                          color={`white`}
                          size={30}
                        />
                      ) : null}
                    </View>
                    <Text style={styles.notificationText}>
                      <Text style={{ fontWeight: "600" }}>
                        Route ID {item.route_id}{" "}
                      </Text>
                      from {item?.departure} to {item?.arrival} for{" "}
                      {item?.company}: {item?.message} on{" "}
                      {item?.status_changed_time}
                    </Text>
                  </View>

                  <Octicons
                    name={"dot-fill"}
                    size={19}
                    color={item?.is_read ? "lightgray" : "lightgreen"}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default DriverNotification;

const styles = StyleSheet.create({
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
  },
  whiteView: {
    flex: 1,
    backgroundColor: "#f2f3f9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "1%",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "3%",
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 0.6,
    justifyContent: "space-between",
  },
  notificationText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 16,
    color: "#333",
    width: "80%",
  },
  readAllText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color: Colors.primary,
  },
  readAllButton: {
    alignItems: "center",
    marginVertical: 10,
    padding: "2%",
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
});
