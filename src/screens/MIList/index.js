import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../Context/AuthContext";

const width = Dimensions.get("window").width;
const MIList = ({ navigation, route }) => {
  const { token, dealerData } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const getimage = (filterText) => {
    const filtered = products.filter((item) =>
      item.name_value_list.name.value
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
    if (filtered.length == 0)
      return "https://dev.ordo.primesophic.com/upload/32CA32A7-15E5-80A8-924F-8C96CEEADD88_download (3).png";
    else return filtered[0].name_value_list.product_image.value;
  };
  const renderListItem = ({ item }) => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 0.25, paddingLeft: 10 }}>
          <Image
            source={{ uri: getimage(item.name_value_list.sku.value) }}
            style={{
              paddingLeft: 10,
              width: 60,
              height: 80,
              resizeMode: "cover",
            }}
          />
        </View>
        <View style={{ flex: 0.75 }}>
          <Text style={styles.title}>{item.name_value_list.name.value}</Text>
          <Text style={{ fontFamily: "AvenirNextCyr-Thin" }}>
            SKU:{" "}
            <Text style={{ color: "#F5904B", fontWeight: "500" }}>
              {item.name_value_list.sku.value}
            </Text>
          </Text>
          <Text style={styles.subtitle}>
            Selling Price :${item.name_value_list.price.value}
          </Text>
          <Text style={styles.subtitle}>
            Qty Sold : {item.name_value_list.sold_qty.value}
          </Text>
          <Text style={styles.subtitletext}>
            {item.name_value_list.dealer_name.value} on{" "}
            {item.name_value_list.date_modified.value}
          </Text>
        </View>
      </View>
    </View>
  );


  useFocusEffect(
    React.useCallback(() => {
      loaddata();
      loadsku();
    }, [])
  );

  const loaddata = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw = JSON.stringify({
      __module_code__: "PO_33",
      __query__: `account_id_c='${dealerData?.id}' and po_ordousers_id_c='${token}'`,
      __orderby__: "",
      __offset__: 0,
      "__select _fields__": ["id", "name"],
      __max_result__: 500,
      __delete__: 0,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.entry_list.length > 0) {
          let sortedarray = result.entry_list.sort((a, b) =>
            a.name_value_list.date_modified.value <
            b.name_value_list.date_modified.value
              ? 1
              : -1
          );
          console.log("sorted array", sortedarray);
          setData(sortedarray);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const loadsku = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw =
      '{\n  "__module_code__": "PO_20",\n    "__query__": "",\n    "__orderby__": "",\n    "__offset__": 0,\n    "__select _fields__": ["id","name"],\n    "__max_result__": 500,\n    "__delete__": 0\n    }';

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://dev.ordo.primesophic.com/get_data_s.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        setProducts(result.entry_list);
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ ...styles.headercontainer }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <FlatList
        style={{ flex: 0.9 }}
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
      />
 
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontSize: 14,
    fontFamily: "AvenirNextCyr-Medium",
  },
  subtitle: {
    color: "#000",
    fontSize: 12,
    fontFamily: "AvenirNextCyr-Thin",
  },
  subtitletext: {
    color: "#a5a5a5",
    fontSize: 10,
    fontFamily: "AvenirNextCyr-Thin",
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
  headercontainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "AvenirNextCyr-Medium",
    color: Colors.black,
    marginLeft: 10,
    marginTop: 3,
  },
});

export default MIList;
