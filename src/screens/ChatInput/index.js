import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Colors from "../../constants/Colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";

const ChatInput = ({ route, navigation }) => {
  const { item } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const refRBSheet = useRef();

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Image source={item.image} style={styles.userImage} />
        <Text style={styles.title1}>{item.userName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.fromMe
                ? styles.myMessageContainer
                : styles.otherMessageContainer,
            ]}
          >
            {!msg.fromMe && (
              <Text style={styles.otherUserName}>{item.userName}</Text>
            )}
            <Text
              style={[
                styles.messageText,
                msg.fromMe ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {msg.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                msg.fromMe ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {msg.time}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <TextInput
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            style={{ flex: 1, fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.open();
            }}
            style={{ transform: [{ rotate: "50deg" }] }}
          >
            <Ionicons name="attach" size={30} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome name="send" size={25} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        dragOnContent={true}
        draggable={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: Colors.ExtraDarkgrey,
            width: "20%",
            marginBottom: "3%",
          },
          container: {
            backgroundColor: Colors.white,
            borderTopLeftRadius: 29,
            borderTopRightRadius: 29,
            height: 300,
          },
        }}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <Text style={styles.dropdownHead}>Share Media</Text>

        <TouchableOpacity
          style={styles.graycircle1}
          onPress={() => {
            refRBSheet.current.close();
          }}
        >
          <AntDesign name="close" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
        >
          <View style={styles.circle}>
            <Feather name="camera" size={24} color={Colors.primary} />
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>Camera</Text>
            <Text style={styles.subTitle}>Capture and share</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.line2}></View>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
        >
          <View style={styles.circle}>
            <Ionicons
              name="document-attach-outline"
              size={28}
              color={Colors.primary}
            />
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>Documents</Text>
            <Text style={styles.subTitle}>Share your files</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.line2}></View>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
        >
          <View style={styles.circle}>
            <Ionicons name="image-outline" size={28} color={Colors.primary} />
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>Media</Text>
            <Text style={styles.subTitle}>Share your photo</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.line2}></View>
      </RBSheet>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: "2%",
    marginBottom: "3%",
    paddingHorizontal: "2%",
  },
  userImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginHorizontal: "3%",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  messagesContainer: {
    flexGrow: 1,
    marginHorizontal: "4%",
  },
  messageContainer: {
    maxWidth: "80%",
    marginBottom: "3%",
    borderRadius: 12,
    paddingHorizontal: "3%",
    paddingVertical: "2%",
    alignSelf: "flex-start",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    marginLeft: "20%",
  },
  otherMessageContainer: {
    backgroundColor: "#f0f0f0",
    marginRight: "20%",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#000",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
  myMessageTime: {
    color: "#eee",
  },
  otherMessageTime: {
    color: "#666",
  },
  otherUserName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#ccc",
    paddingRight: "2%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: "2%",
    paddingVertical: "2%",
    marginRight: "2%",
    backgroundColor: "#fafafa",
    marginHorizontal: "3%",
    marginVertical: "4%",
    height: 55,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: "3%",
    paddingHorizontal: "4%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownHead: {
    fontSize: 22,
    color: Colors.black,
    marginTop: "4%",
    textAlign: "center",
    fontFamily: "AvenirNextCyr-Medium",
    marginBottom: "3%",
  },
  line2: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
    height: 1,
    marginVertical: "4%",
  },
  circle: {
    backgroundColor: "#F3ECF5",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: "3%",
  },
  title: {
    fontSize: 18,
    color: "black",
    fontFamily: "AvenirNextCyr-Medium",
  },
  subTitle: {
    fontSize: 14,
    color: "gray",
    fontFamily: "AvenirNextCyr-Medium",
  },
  graycircle1: {
    width: 30,
    height: 30,
    borderRadius: 19,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 15,
    top: 15,
  },
});
