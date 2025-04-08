import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import styles from "./style";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { Searchbar, Menu, Provider, Checkbox } from "react-native-paper";

const UserList = ({ navigation, route }) => {
  const [data, setData] = useState("");
  // const { token } = useContext(AuthContext);

  const [token, setToken] = useState("2bb36b96-2bcb-3c52-2ee1-64a54b69ddcf");
  console.log("token", token);
  //fetching past conversation
  useFocusEffect(
    React.useCallback(() => {
      console.log("inside use effect");
      const ws = new WebSocket("wss://nikaigroup.ordosolution.com:8090");
      //open connection
      ws.onopen = (e) => {
        console.log("ordo WebSocket connection opened");
        ws.send(
          JSON.stringify({
            type: "past_conversation",
            by: token,
            device_type: "mobile",
          })
        );
        console.log("past conversation request sent");
      };
      ws.onmessage = (e) => {
        //alert("pass conversation reponse reicved");
        // a message was received
        console.log("past conversation response\n", e.data);
        let res = JSON.parse(e.data);
        if (res?.api_name == "past_conversation") {
          setData(res?.data);
        }
      };
      ws.onerror = (e) => {
        // an error occurred
        console.log("ordo web socket connection failed ", e.message);
      };
      ws.onclose = () => {
        console.log("ordo WebSocket connection closed");
      };
      return () => {
        ws.close();
      };
    }, [])
  );

  const formatLastMessageDate = (lastMessage) => {
    if (!lastMessage) {
      return "No date available";
    }

    const lastMessageDate = moment(lastMessage);
    if (!lastMessageDate.isValid()) {
      return "Invalid date";
    }

    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (lastMessageDate.isSame(today, "d")) {
      return "Today";
    } else if (lastMessageDate.isSame(yesterday, "d")) {
      return "Yesterday";
    } else {
      return lastMessageDate.format("MMM D");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.flatViewcontainer}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate("Chat", { item: item, token: token })
        }
      >
        <View style={styles.msgContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.profile_image ? (
              <Image
                style={styles.imgStyle}
                source={{ uri: item?.profile_image }}
              />
            ) : (
              <Image
                source={require("../../assets/images/Portrait_Placeholder.png")}
                style={styles.imgStyle}
              />
            )}
            <View
              style={{
                flexDirection: "column",
                marginLeft:'5%'
              }}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={{color:'gray'}}>💬...</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2%",
            }}
          >
            <Text style={{ color: "gray", fontSize: 13 }}>
              {formatLastMessageDate(item.last_message)}
            </Text>
            {/* showing unread message count */}
            {item.unread_message >= 0 && (
              <View style={styles.unreadContainer}>
                <Text style={styles.unreadText}>{item.unread_message}1</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerText}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Icon name="search1" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.whiteView}>
        <FlatList
          data={data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
};

export default UserList;
