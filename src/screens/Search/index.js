import React, { useState, useContext } from "react";
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  FlatList,
  SectionList,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import styles from "./style";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { Searchbar, Menu, Provider, Checkbox } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

const Search = ({ navigation, route }) => {
  // const {token} = useContext(AuthContext);
  const [token, setToken] = useState("2bb36b96-2bcb-3c52-2ee1-64a54b69ddcf");
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  //fetching users conversation
  useFocusEffect(
    React.useCallback(() => {
      const ws = new WebSocket("wss://nikaigroup.ordosolution.com:8090");
      //open connection
      ws.onopen = (e) => {
        console.log("ordo WebSocket connection opened");
        ws.send(
          JSON.stringify({
            type: "get_users",
            by: token,
            device_type: "mobile",
          })
        );
        console.log("get users request sent");
      };
      ws.onmessage = (e) => {
        // a message was received
        console.log("response\n", e.data);
        //parsing data
        console.log("get user response\n", e.data);
        let res = JSON.parse(e.data);
        if (res?.api_name == "get_users") {
          setFilteredDataSource(res?.data);
          setMasterDataSource(res?.data);
        }
      };
      ws.onerror = (e) => {
        // an error occurred
        console.log("ordo web socket connection failed ", e.message);
      };
      ws.onclose = () => {
        console.log("ordo WebSocket connection closed");
      };
      return () => ws.close();
    }, [])
  );

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const navigateToChat = (item) => {
    if (item?.convo_id == null) {
      navigation.navigate("Chat", { item: item, token: token, newChat: true });
    } else {
      navigation.navigate("Chat", { item: item, token: token });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.flatViewcontainer}
        activeOpacity={0.5}
        onPress={() => navigateToChat(item)}
      >
        <Image style={styles.imgStyle} source={{ uri: item?.profile_image }} />
        <View
          style={{ marginLeft: 10, justifyContent: "space-evenly", flex: 1 }}
        >
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Ionicons
          name="chatbubble-ellipses-outline"
          color={Colors.primary}
          size={24}
        />
      </TouchableOpacity>
    );
  };
  return (
    // <View style={styles.container}>
    //     <View style={styles.header}>
    //         <TouchableOpacity onPress={() => navigation.goBack()}>
    //             <Icon name='arrowleft' size={25} color='#000' />
    //         </TouchableOpacity>
    //         <TextInput
    //             style={styles.input}
    //             onChangeText={(text) => searchFilterFunction(text)}
    //             value={search}
    //             placeholder='Search User'
    //             placeholderTextColor='grey'
    //             autoFocus={true}
    //         />

    //     </View>

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
        <Text style={styles.headerText}>Search</Text>
        <View style={{ width: "15%" }} />
      </View>
      <Searchbar
        style={styles.searchbar}
        placeholder="Search User"
        placeholderTextColor="grey"
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
      />
      <View style={styles.whiteView}>
        <FlatList
          data={filteredDataSource}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </LinearGradient>
  );
};

export default Search;
