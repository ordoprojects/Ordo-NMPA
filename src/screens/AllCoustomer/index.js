import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import Colors from "../../constants/Colors";
import { AnimatedFAB, Snackbar } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import { hs, vs, ms } from "../../utils/Metrics";
import { AuthContext } from "../../Context/AuthContext";

const UserMgmt = ({ navigation, visible }) => {
  const [masterData, setMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isExtended, setIsExtended] = useState(true);
  const { token, userData } = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUsers();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    console.log("loading all product");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    console.log("dfsddfdsfds", userData.token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://dev.ordo.primesophic.com/get_accounts.php/", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        setMasterData(result);
        setFilteredData(result);
      })
      .catch((error) => {
        console.log("error in get suppliers", error);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.userContainer]}
        key={item.id}
        onPress={() => {
          navigation.navigate("UserDetails", { item });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Image
            source={
              item.profile_image
                ? { uri: item.profile_image }
                : require("../../assets/images/UserAvatar.png")
            }
            style={{ ...styles.image }}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>
            <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}></Text>
            {item.city}
          </Text>
          <Text style={styles.detail}>
            <Text style={{ fontFamily: "AvenirNextCyr-Medium" }}></Text>
            {item.street}
          </Text>
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
      style={styles.gradiant}
    >
      <Text style={styles.headertxt}>My Customers</Text>

      <View style={styles.view1}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
        />
      </View>

      <AnimatedFAB
        label={"Add User    "}
        icon={(name = "plus")}
        color={"white"}
        style={styles.fabStyle}
        fontFamily={"AvenirNextCyr-Thin"}
        extended={isExtended}
        visible={visible}
        animateFrom={"right"}
        iconMode={"static"}
        onPress={() => {
          navigation.navigate("AddUser", { screen: "add" });
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  userContainer: {
    flexDirection: "row",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "white",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  userInfo: {
    flex: 1,
    marginTop: 5,
    marginLeft: 15,
  },
  name: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 5,
  },
  btnText: {
    fontFamily: "AvenirNextCyr-Medium",
    color: "#fff",
    fontSize: 18,
  },
  fab: {
    borderRadius: 50,
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    fontFamily: "AvenirNextCyr-Thin",
  },
  fabStyle: {
    position: "absolute",
    margin: 20,
    right: "0%",
    bottom: 90,
    backgroundColor: Colors.primary,
  },
  view1: {
    height: "88%",
    backgroundColor: "#f5f5f5",
    width: "100%",
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    padding: 20,
    paddingBottom: "15%",
  },
  headertxt: {
    fontFamily: "AvenirNextCyr-Medium",
    fontSize: 19,
    color: "white",
    marginBottom: "4%",
  },
  gradiant: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default UserMgmt;
