import { Pressable, StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TextInput as TextInput1, Button as Button1 } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import globalStyles from '../styles/globalStyles';
import Icon from "react-native-vector-icons/FontAwesome";
import { ms } from '../utils/Metrics';
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from '../Context/AuthContext';


import Colors from '../constants/Colors';

const AddFloating = ({ navigation, reports, screen }) => {
  const { token, userData } = useContext(AuthContext);

  const [isFocus3, setIsFocus3] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [brandData, setBrandData] = useState([]);

  const [brandResponse, setBrandResponse] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");


  const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const fourthValue = useSharedValue(30);
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const fourthWidth = useSharedValue(60);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);

  };

  useEffect(() => {
    getBrand();
  }, []);

  // console.log("user dta", userData.token)


  const getBrand = async (userId) => {
    // Fetch category list API
    var myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${userData.token}`);
    var raw = "";

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://gsidev.ordosolution.com/api/company/",
        requestOptions
      );
      const result = await response.json();

      console.log("brand", result);
      setBrandResponse(result);

      const allOption = { label: 'All', value: 'all' };
      const transformedData = result.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));

      // Filter out duplicate labels and remove "All" if already present
      const uniqueData = transformedData.filter((item, index, array) => {
        return array.findIndex((i) => i.label === item.label) === index;
      });

      // console.log("dhalfahljfahfaiiq", uniqueData);
      setBrandData(uniqueData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const clearModalValue = () => {
    setName("");
    setSelectedBrand("");
  };

  const handleSubmit = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userData.token}`);

    var raw = JSON.stringify({
      name: name,
      //   user: userData.id,
      description: '',
      company: selectedBrand
    });

    console.log("rawwwww", raw);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://gsidev.ordosolution.com/api/product_category/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        setModalVisible(false);
        clearModalValue();
      })
      .catch((error) => {
        console.log("add category api erro", error);
      });
  };

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config));
        }
      });
      fourthWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          fourthValue.value = withDelay(100, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withDelay(100, withSpring(290));
      fourthValue.value = withSpring(370);

      firstWidth.value = withDelay(1200, withSpring(200));
      secondWidth.value = withDelay(1100, withSpring(200));
      thirdWidth.value = withDelay(1100, withSpring(200));
      fourthWidth.value = withDelay(1000, withSpring(200));

      opacity.value = withDelay(1200, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    };
  });

  const fourthWidthStyle = useAnimatedStyle(() => {
    return {
      width: fourthWidth.value,
    };
  });


  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    };
  });

  const fourthIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      fourthValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: fourthValue.value,
      transform: [{ scale: scale }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  // console.log("screen",screen);

  return (
    <View style={styles.container}>



      <AnimatedTouchable
        onPress={() => { navigation.navigate("MerchAddProduct") }}
        style={[styles.contentContainer, secondIcon, secondWidthStyle]}>
        <View style={styles.iconContainer}>
          <AntDesign name="shoppingcart" size={24} color="white" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>
          Add Product
        </Animated.Text>

      </AnimatedTouchable>




      <AnimatedTouchable
        onPress={() => {
          toggleModal();
        }}

        style={[styles.contentContainer, firstIcon, firstWidthStyle]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="category" size={24} color="white" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>
          Add Category
        </Animated.Text>
      </AnimatedTouchable>
      <Pressable
        style={styles.contentContainer}
        onPress={() => {
          handlePress();
        }}>
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <AntDesign name="plus" color="white" size={28} />
        </Animated.View>
      </Pressable>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
        // onPressOut={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="times" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.modalInnerContent}>

              {/* {userData && userData.dealer_name === 'Nikai Electronics' && ( */}
              <View style={styles.container1}>
                <Text style={{
                  color: "#000000",
                  textAlign: "center",
                  fontSize: 18,
                  fontFamily: "AvenirNextCyr-Bold",
                  marginBottom: "2%",
                }}>Add Category</Text>

                <TextInput1
                  mode="outlined"
                  label="Name"
                  theme={{ colors: { onSurfaceVariant: "black" } }}
                  activeOutlineColor="#4b0482"
                  // placeholder="Enter User Name"
                  outlineColor="#B6B4B4"
                  textColor="black"
                  onChangeText={(text) => setName(text)}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  value={name}
                  // keyboardType="number-pad"
                  returnKeyType="done"
                  outlineStyle={{ borderRadius: ms(5) }}
                  style={{
                    marginBottom: "2%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                />
                <Text style={styles.ModalText1}>Select Company</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus3 && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  data={brandData}
                  search
                  maxHeight={400}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus3 ? "Select Company" : "..."}
                  searchPlaceholder="Search..."
                  value={selectedBrand}
                  onFocus={() => setIsFocus3(true)}
                  onBlur={() => setIsFocus3(false)}
                  onChange={(item) => {
                    setSelectedBrand(item.value);
                    // getCategory(item.value)
                    setIsFocus3(false);
                  }}
                />
              </View>
              <LinearGradient
                colors={Colors.linearColors}
                start={Colors.start}
                end={Colors.end}
                locations={Colors.ButtonsLocation}
                style={{ borderRadius: 8, marginHorizontal: '2.5%' }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AddFloating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    // backgroundColor: '#0F56B3',
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: 50,
    right: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  searchModal: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    ...globalStyles.border,
    marginVertical: 100,
  },
  modalSearchContainer: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: "black",
    fontFamily: "AvenirNextCyr-Bold",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 6,
    fontFamily: "AvenirNextCyr-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the modal content horizontally
  },

  closeIcon: {
    position: "absolute",
    top: 0, // Set the top offset to 0 (right above the modal content)
    right: 5,
    padding: 10,
  },
  modalInnerContent: {
    marginTop: 15, // Add a margin to separate the icon from the modal content
  },
  ModalText1: {
    color: "#000000",
    textAlign: "left",
    fontSize: 15,
    fontFamily: "AvenirNextCyr-Bold",
    marginLeft: 1,
    marginBottom: '2%'
  },
  container1: {
    backgroundColor: "white",
    padding: 16,
    width: "100%", // Adjust the width as needed, for example '90%'
    alignSelf: "center", // Center the container horizontally within the modal
  },

  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },

  icon1: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Medium",
  },
  submitButton: {

    // backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    // marginTop: 8,
    // marginLeft: 15,
    // marginRight: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "AvenirNextCyr-Bold",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%", // Set the desired width for the dropdown, for example '100%' to match the parent container
  },
});