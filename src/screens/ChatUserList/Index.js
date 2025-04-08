import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { Searchbar } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

const dummyUsers = [
  {
    id: "1",
    name: "Robert D",
    image: {
      uri: "https://img.mensxp.com/media/content/2020/Sep/Male-Celebrities-Who-Have-Dabbled-With-Some-Really-Outlandish-1200x900_5f62142e3dc6c.jpeg",
    },
  },
  {
    id: "2",
    name: "Scarlett ",
    image: {
      uri: "https://m.media-amazon.com/images/M/MV5BY2UyOGMzMDUtZDgxNS00YTYxLTlhYWMtMTM4Y2VmZmI5Y2E5XkEyXkFqcGdeQXVyODk4Nzg5NjE@._V1_.jpg",
    },
  },
  {
    id: "3",
    name: "Chris ",
    image: {
      uri: "https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/1272/cached.offlinehbpl.hbpl.co.uk/news/ORP/Kanye_4.jpg",
    },
  },
  {
    id: "4",
    name: "Chris Evans",
    image: {
      uri: "https://img.buzzfeed.com/buzzfeed-static/static/2020-11/12/21/asset/b537877860a1/sub-buzz-2914-1605214930-12.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    },
  },
  {
    id: "5",
    name: "Mark Ruffalo",
    image: {
      uri: "https://assets.teenvogue.com/photos/5f4a51db79acd104fca38e4e/16:9/w_2560%2Cc_limit/GettyImages-927248486.jpg",
    },
  },
  {
    id: "6",
    name: "Chris ",
    image: {
      uri: "https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/1272/cached.offlinehbpl.hbpl.co.uk/news/ORP/Kanye_4.jpg",
    },
  },
  {
    id: "7",
    name: "Chris Evans",
    image: {
      uri: "https://img.buzzfeed.com/buzzfeed-static/static/2020-11/12/21/asset/b537877860a1/sub-buzz-2914-1605214930-12.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    },
  },
  {
    id: "8",
    name: "Mark Ruffalo",
    image: {
      uri: "https://assets.teenvogue.com/photos/5f4a51db79acd104fca38e4e/16:9/w_2560%2Cc_limit/GettyImages-927248486.jpg",
    },
  },
];

const dummyChats = [
  {
    id: "101",
    userId: "1",
    userName: "Robert D",
    lastMessage: "Hey there! What's up?",
    time: "10:30 AM",
    unreadMessages: 2,
    online: true,
    image: {
      uri: "https://assets.teenvogue.com/photos/5f4a51db79acd104fca38e4e/16:9/w_2560%2Cc_limit/GettyImages-927248486.jpg",
    },
  },
  {
    id: "101",
    userId: "1",
    userName: "Scarlett",
    lastMessage: "Hey there! What's up?",
    time: "6:11 PM",
    unreadMessages: 3,
    online: false,
    image: {
      uri: "https://m.media-amazon.com/images/M/MV5BY2UyOGMzMDUtZDgxNS00YTYxLTlhYWMtMTM4Y2VmZmI5Y2E5XkEyXkFqcGdeQXVyODk4Nzg5NjE@._V1_.jpg",
    },
  },
  {
    id: "102",
    userId: "2",
    userName: "Chris",
    lastMessage: "Hey there! What's up?",
    time: "11:45 AM",
    unreadMessages: 2,
    online: false,
    image: {
      uri: "https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/1272/cached.offlinehbpl.hbpl.co.uk/news/ORP/Kanye_4.jpg",
    },
  },
  {
    id: "103",
    userId: "3",
    userName: "Snpoo D",
    lastMessage: "Hey there! What's up?",
    time: "1:30 AM",
    unreadMessages: 4,
    online: true,
    image: {
      uri: "https://img.mensxp.com/media/content/2020/Sep/Male-Celebrities-Who-Have-Dabbled-With-Some-Really-Outlandish-1200x900_5f62142e3dc6c.jpeg",
    },
  },
  {
    id: "104",
    userId: "4",
    userName: "Will Smith",
    lastMessage: "Hey there! What's up?",
    time: "3:44 AM",
    unreadMessages: 3,
    online: true,
    image: {
      uri: "https://img.buzzfeed.com/buzzfeed-static/static/2020-11/12/21/asset/b537877860a1/sub-buzz-2914-1605214930-12.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    },
  },
];

const ChatUserList = ({ navigation, route }) => {
  const [search, setSearch] = useState("");

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
          style={{ paddingLeft: "2%" }}
        >
          <Image
            source={require("../../assets/images/Refund_back.png")}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.headerText}>ORDO</Text>
        </TouchableOpacity>
        <Ionicons name="person-add" color={Colors.white} size={24} />
      </View>
      <View style={styles.whiteView}>
        <View>
          <FlatList
            horizontal
            data={dummyUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <LinearGradient
                  colors={Colors.linearColors}
                  start={Colors.start}
                  end={Colors.end}
                  style={styles.userGradient}
                >
                  <Image source={item.image} style={styles.userImage} />
                </LinearGradient>
                <Text style={styles.userName}>{item.name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.userList}
          />
        </View>
        <Searchbar
          style={styles.searchbar}
          placeholder="Search User"
          placeholderTextColor="grey"
          onChangeText={(val) => setSearch(val)}
          value={search}
        />
        <FlatList
          data={dummyChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => {
              console.log(item);
              navigation.navigate("ChatInput", { item });
            }}
          >
          
              <View style={styles.chatItem}>
                <View style={styles.userContainer1}>
                  <Image source={item.image} style={styles.userImage} />
                  {item.online && <View style={styles.onlineIndicator}></View>}
                </View>
                <View style={styles.chatItemText}>
                  <Text style={styles.chatItemName}>{item.userName}</Text>
                  <Text style={styles.chatItemMessage}>{item.lastMessage}</Text>
                </View>
                <View style={styles.chatItemInfo}>
                  <Text style={styles.chatItemTime}>{item.time}</Text>
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadMessages}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default ChatUserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f3f9",
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
  },
  searchbar: {
    marginHorizontal: "4%",
    backgroundColor: "white",
    fontFamily: "AvenirNextCyr-Thin",
    height: 50,
  },
  whiteView: {
    flex: 1,
    backgroundColor: "#f2f3f9",
    borderTopLeftRadius: 50,
    marginTop: "1%",
  },
  userList: {
    paddingVertical: "2%",
    paddingLeft: "4%",
  },
  userContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  userContainer1: {
    alignItems: "center",
    marginRight: "1%",
  },
  userGradient: {
    height: 63,
    width: 63,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    height: 54,
    width: 54,
    borderRadius: 27,
    backgroundColor: "white",
    borderWidth: 0.9,
    borderColor: Colors.white,
  },
  userName: {
    marginTop: 5,
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 12,
    color: "black",
    width: 70,
    textAlign: "center",
  },
  chatItemContainer: {
    paddingHorizontal: "4%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatItemImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  chatItemText: {
    flex: 1,
    marginLeft: 10,
  },
  chatItemName: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 16,
    color: "black",
  },
  chatItemMessage: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 14,
    color: "grey",
  },
  chatItemInfo: {
    alignItems: "flex-end",
  },
  chatItemTime: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 12,
    color: "grey",
  },
  unreadBadge: {
    backgroundColor: "#0BDA51",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
    alignItems: "center",
  },
  unreadText: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 11,
    color: "white",
  },
  onlineIndicator: {
    backgroundColor: "#32CD32",
    height: 10,
    width: 10,
    borderRadius: 25,
    position: "absolute",
    top: 3,
    right: 2,
  },
});
