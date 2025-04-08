import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import styles from "./style";
import Icon from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "react-native-document-picker";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";

import InChatFileTransfer from "./InChatFileTransfer";
import { launchCamera } from "react-native-image-picker";
import FileViewer from "react-native-file-viewer";
import { useFocusEffect } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import RNFetchBlob from "rn-fetch-blob";
import RNFS, { DownloadDirectoryPath } from "react-native-fs";
import { AuthContext } from "../../Context/AuthContext";
import { cameraPermission, checkImageSize } from "../../utils/Helper";
import Colors from "../../constants/Colors";
import { ProgressDialog } from "react-native-simple-dialogs";
import { SelectList } from "react-native-dropdown-select-list";
import ImageResizer from "@bam.tech/react-native-image-resizer";


const CustomInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={styles.primaryStyle}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={props.text}
            onChangeText={props.onTextChanged}
            // placeholder="Type a message..."
            placeholderTextColor="#888"
          />
        </View>
      </InputToolbar>
    );
  };

const Chat = ({ route, navigation }) => {
  const { item } = route.params;
  const [newChat, setNewChat] = useState(route.params?.newChat);

  const profileImg = item?.profile_image;
  const { token } = useContext(AuthContext);

  //message hooks
  const [messages, setMessages] = useState([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [filePath, setFilePath] = useState({
    name: "",
    type: "",
    path: "",
  });

  const fileInfo = useRef({
    name: "",
    type: "",
    file_id: "",
  });
  const [loading, setLoading] = useState("");
  const [loading2, setLoading2] = useState("");

  const [conversationId, setconversationId] = useState(item?.convo_id);
  console.log("item", item);
  let user_idArray = item?.user_ids?.split(",");

  const user_id = token;
  const convo_user_id =
    token != user_idArray[0] ? user_idArray[0] : user_idArray[1];
  console.log("current user id", user_id);
  console.log("convo_user id", convo_user_id);
  const ws = new WebSocket("wss://nikaigroup.ordosolution.com:8090");

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

  useEffect(() => {
    //foreground notification
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log("incomig message", remoteMessage?.data);
      let itm = remoteMessage?.data;
      if (itm?.convo_id == conversationId) {
        //checking conversaton id of chat & notification are same

        let msg = {
          _id: itm?.message_id, //msg id
          text: itm?.message,
          createdAt: itm?.date_created,
          user: {
            _id: itm?.user_id, //sender id
            name: itm?.name,
            avatar: itm?.profile_image,
          },
        };
        if (itm.media) {
          //checking it contains file
          //chekcing document is image
          if (
            itm.file_mime_type == "png" ||
            itm.file_mime_type == "jpg" ||
            itm.file_mime_type == "jpeg" ||
            itm.file_mime_type == "heic"
          ) {
            msg = { ...msg, image: itm.media };
          }
          //othr type of documents
          else {
            msg = {
              ...msg,
              file: {
                url: itm.media,
                type: itm.file_mime_type,
                name: itm.file_name,
              },
            };
          }
        }
        //checking user share only document
        if (itm?.message == "shared document") {
          msg = { ...msg, text: null };
        }
        console.log("message ", msg);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      }
    });

    return unsubscribe;
  }, []);

  //fetching previous conversation
  useFocusEffect(
    React.useCallback(() => {
      //open connection
      ws.onopen = (e) => {
        console.log("ordo WebSocket connection opened");
        //seding load more conversation request
        if (!newChat) {
          ws.send(
            JSON.stringify({
              type: "load_convo",
              convo_id: item?.convo_id,
              device_type: "mobile",
              user_id: convo_user_id,
            })
          );
        }
        //console.log("load convo request sent")
      };
      ws.onmessage = (e) => {
        // a message was received
        console.log("load more conversation response\n", e.data);
        let tempmsgArray = [];
        let res = JSON.parse(e.data);
        if (res?.api_name == "send_message") {
          setNewChat(false);
          setconversationId(res?.convo_id);
        }
        if (res?.api_name == "load_convo") {
          //setData(res?.data);
          //pushing to temp array
          res?.data.forEach((item) => {
            //moment.format()

            let msg = {
              _id: item?.message_id, //msg id
              text: item?.message,
              createdAt: item?.date_created,
              user: {
                _id: item?.user_id, //sender id
                name: item?.name,
                avatar: profileImg,
              },
            };
            if (item.url) {
              //chekcing document is image
              if (
                item.file_mime_type == "png" ||
                item.file_mime_type == "jpg" ||
                item.file_mime_type == "jpeg" ||
                item.file_mime_type == "heic"
              ) {
                msg = { ...msg, image: item.url };
              }
              //othr type of documents
              else {
                msg = {
                  ...msg,
                  file: {
                    url: item.url,
                    type: item.file_mime_type,
                    name: item.file_name,
                  },
                };
              }
            }
            tempmsgArray.push(msg);
          });
          setMessages(tempmsgArray);
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

  // //intial default message
  // useEffect(() => {
  //     setMessages([
  //         {
  //             _id: 1, //msg id
  //             text: 'Hello developer',
  //             createdAt: new Date(),
  //             user: {
  //                 _id: 2, //sender id
  //                 name: 'React Native',
  //                 avatar: 'https://placeimg.com/140/140/any',
  //             },
  //             image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS785biEGWYfQ3kCbvts_QRuNPn7IJpvovN4A&usqp=CAU',

  //         },

  //     ])
  // }, [])

  //send fuction
  const onSend = useCallback(
    (messages = []) => {
      console.log("called");
      let msg = messages[0];
      console.log("msg", msg);
      let data = {
        avatar: profileImg,
        message: msg?.text,
        name: item?.name,
      };
      //if message contains image
      if (isAttachImage) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, { ...msg, image: imagePath })
        );
        setImagePath("");
        setIsAttachImage(false);
        //console.log("fileinfo",fileInfo.base64)
        console.log(
          JSON.stringify({
            type: "chat_sent",
            data: data,
            convo_id: conversationId,
            by: user_id,
            user_ids: item?.user_ids,
            to_id: convo_user_id,
            media: fileInfo.current,
            device_type: "mobile",
          })
        );
        ws.send(
          JSON.stringify({
            type: "chat_sent",
            data: data,
            convo_id: conversationId,
            by: user_id,
            user_ids: item?.user_ids,
            to_id: convo_user_id,
            media: fileInfo.current,
            device_type: "mobile",
          })
        );
        console.log(" chat with img request sent");
      } else if (isAttachFile) {
        //if message contains file
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, {
            ...msg,
            file: {
              url: filePath.path,
              type: filePath.type,
              name: filePath.name,
              local: true,
            },
          })
        );
        setFilePath("");
        setIsAttachFile(false);
        console.log("**send chat detials**");
        // console.log("by : ",user_id);
        // console.log("user_ids : ",item?.user_ids);
        // console.log("to_id : ",convo_user_id);
        // console.log("data")

        console.log(
          JSON.stringify({
            type: "chat_sent",
            data: data,
            convo_id: conversationId,
            by: user_id,
            user_ids: item?.user_ids,
            to_id: convo_user_id,
            media: fileInfo.current,
            device_type: "mobile",
          })
        );

        console.log("\n ********fileinfo ******\n", fileInfo.current);
        ws.send(
          JSON.stringify({
            type: "chat_sent",
            data: data,
            convo_id: conversationId,
            by: user_id,
            user_ids: item?.user_ids,
            to_id: convo_user_id,
            media: fileInfo.current,
            device_type: "mobile",
          })
        );
        console.log(" chat with doc request sent");
      } else {
        //just text message
        console.log("text message");
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );
        if (newChat) {
          ws.send(
            JSON.stringify({
              type: "chat_sent",
              data: data,
              convo_id: "",
              by: user_id,
              user_ids: item?.user_ids,
              to_id: convo_user_id,
              device_type: "mobile",
            })
          );
          console.log("new chat request sent");
        } else {
          ws.send(
            JSON.stringify({
              type: "chat_sent",
              data: data,
              convo_id: conversationId,
              by: user_id,
              user_ids: item?.user_ids,
              to_id: convo_user_id,
              device_type: "mobile",
            })
          );
          console.log(
            "text mesg sent",
            JSON.stringify({
              type: "chat_sent",
              data: data,
              convo_id: conversationId,
              by: user_id,
              user_ids: item?.user_ids,
              to_id: convo_user_id,
              device_type: "mobile",
            })
          );
        }
        //console.log("sent request sent")
      }
    },
    [filePath, imagePath, isAttachFile, isAttachImage]
  );

  //custom send component
  const renderSend = (props) => {
    return (
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={pickDocument}>
          <Image
            style={styles.docIcon}
            source={require("../../assets/images/document.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={checkPermission}>
          <Image
            style={styles.docIcon}
            source={require("../../assets/images/camera.png")}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => console.log("gallery pressed")}>
                    <Image style={styles.docIcon} source={require('../../assets/images/gallery.png')} />
                </TouchableOpacity> */}
        <Send {...props} containerStyle={{ alignItems: newFunction() }}>
          <Image
            style={styles.sendIcon}
            source={require("../../assets/images/send.png")}
          />
        </Send>
      </View>
    );
  };

  const sendDocument = () => {
    console.log("called", fileInfo.current);
    console.log("iamge path", imagePath);

    let msg = {
      _id: Date.now().toString() + Math.random().toString(36).substring(7),
      text: null,
      createdAt: new Date(),
      user: {
        _id: user_id,
      },
    };
    console.log(msg);
    console.log("file type", fileInfo.current.type);
    //image
    if (
      fileInfo.current.type == "png" ||
      fileInfo.current.type == "jpg" ||
      fileInfo.current.type == "jpeg" ||
      fileInfo.current.type == "heic"
    ) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, { ...msg, image: imagePath })
      );
      setImagePath("");
      console.log("clearing image path hook");
    }
    //document
    else {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, {
          ...msg,
          file: {
            url: filePath.path,
            type: filePath.type,
            name: filePath.name,
            local: true,
          },
        })
      );
      setFilePath("");
    }
    setIsAttachFile(false);

    let data = {
      avatar: profileImg,
      message: msg?.text,
      name: item?.name,
    };
    ws.send(
      JSON.stringify({
        type: "chat_sent",
        data: data,
        convo_id: conversationId,
        by: user_id,
        user_ids: item?.user_ids,
        to_id: convo_user_id,
        media: fileInfo.current,
        device_type: "mobile",
      })
    );




    // //if message contains image
    // if (isAttachImage) {
    //     setMessages(previousMessages =>
    //         GiftedChat.append(previousMessages, { image: imagePath }),
    //     );
    //     setImagePath('');
    //     setIsAttachImage(false);
    //     //console.log("fileinfo",fileInfo.base64)
    //     console.log(JSON.stringify({ type: 'chat_sent', data: data, convo_id: conversationId, by: user_id, user_ids: item?.user_ids, to_id: convo_user_id, media: fileInfo.current, device_type: 'mobile' }))
    //     ws.send(JSON.stringify({ type: 'chat_sent', data: data, convo_id: conversationId, by: user_id, user_ids: item?.user_ids, to_id: convo_user_id, media: fileInfo.current, device_type: 'mobile' }))
    //     console.log(" chat with img request sent")
    // }
    // else if (isAttachFile) {  //if message contains file
    //     console.log("**send chat detials**");
    //     setMessages(previousMessages =>
    //         GiftedChat.append(previousMessages, { file: { url: filePath.path, type: filePath.type, name: filePath.name, local: true } }),
    //     );
    //     setFilePath('');
    //     setIsAttachFile(false);
    //     console.log("**send chat detials**");
    //     // console.log("by : ",user_id);
    //     // console.log("user_ids : ",item?.user_ids);
    //     // console.log("to_id : ",convo_user_id);
    //     // console.log("data")

    //     console.log(JSON.stringify({
    //         type: 'chat_sent', data: data, convo_id: conversationId, by: user_id, user_ids: item?.user_ids, to_id: convo_user_id, media: fileInfo.current, device_type: 'mobile'
    //     }))

    //     console.log("\n ********fileinfo ******\n", fileInfo.current)
    //     ws.send(JSON.stringify({
    //         type: 'chat_sent', data: data, convo_id: conversationId, by: user_id, user_ids: item?.user_ids, to_id: convo_user_id, media: fileInfo.current, device_type: 'mobile'
    //     }))
    //     console.log(" chat with doc request sent")

    // }
  };

  // let myMsg = {
  //     ...messages[0],
  //     senderId: '1',
  //     receiverId: '2'
  // }
  // console.log("msg", myMsg);
  // setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
  // data = {
  //     avatar: "",
  //     id: "1",
  //     message: "test message from mobile",
  //     name: "Administrator",

  //   }
  // ws.current.send(JSON.stringify({ type: 'chat_sent', data: data, convo_id: 'c81e728d9d4c2f636f067f89cc14862c', by: '1', user_ids: 'c011fd3d-16d9-21da-257f-637320e613c4,1', device_type: 'mobile' }))

  //console.log("outside", fileVisible)
  //custom bubble component
  const renderbubble = (props) => {
    const { currentMessage } = props;
    //console.log("inside ubble", fileVisible)
    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === 1 ? Colors.primary : "#efefef",
            borderBottomLeftRadius:
              props.currentMessage.user._id === 1 ? 15 : 5,
            borderBottomRightRadius:
              props.currentMessage.user._id === 1 ? 5 : 15,
          }}
          onPress={async () => {
            console.log("file url", currentMessage.file.url);

            //showing local files
            if (currentMessage.file.local) {
              FileViewer.open(currentMessage.file.url, {
                showOpenWithDialog: true,
              }) // absolute-path-to-my-local-file.
                .then(() => {
                  // success
                  console.log("file opened");
                })
                .catch((error) => {
                  alert(`Can't find an application to open this file`);
                  // error
                  console.log("error", error);
                });
            }
            //
            else {
              setLoading2(true);
              let url = currentMessage.file.url;
              // const url =
              //     "https://dev.ordo.primesophic.com/index.php?preview=yes&entryPoint=downloadquote&id=c80108c4-0a0e-c9bf-eaea-645e4838b6d2&type=Documents";

              // *IMPORTANT*: The correct file extension is always required.
              // You might encounter issues if the file's extension isn't included
              // or if it doesn't match the mime type of the file.
              // https://stackoverflow.com/a/47767860
              // function getUrlExtension(url) {
              //     return url.split(/[#?]/)[0].split(".").pop().trim();
              // }

              // const extension = getUrlExtension(url);

              // // Feel free to change main path according to your requirements.
              // const localFile = `${RNFS.DownloadDirectoryPath}/abcd.pdf`;
              // //RNFS.DownloadDirectoryPath

              // console.log("local file", localFile);
              const downloadDest = `${DownloadDirectoryPath}/${Date.now()}.${
                currentMessage.file.type
              }`;
              const options = {
                fromUrl: url,
                toFile: downloadDest,
              };

              const downloadResult = await RNFS.downloadFile(options).promise;
              if (downloadResult.statusCode === 200) {
                setLoading2(false);
                console.log("PDF saved to Download folder:", downloadDest);
                FileViewer.open(downloadDest, { showOpenWithDialog: true }) // absolute-path-to-my-local-file.
                  .then(() => {
                    // success
                    console.log("file opened");
                  })
                  .catch((error) => {
                    alert(`Can't find an application to open this file`);
                    // error
                    console.log("error", error);
                  });
                // Show a success message to the user if needed
              } else {
                console.log("Failed to save PDF:", downloadResult);
                setLoading2(false);
                // Handle the error or show an error message to the user
              }
            }
          }}
        >
          <InChatFileTransfer
            style={{ marginTop: -10 }}
            filePath={currentMessage.file.url}
            name={currentMessage.file.name}
            type={currentMessage.file.type}
          />
          {/* <InChatViewFile
                        props={props}
                        visible={fileVisible}
                        onClose={() => setFileVisible(false)}
                    /> */}
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                ...styles.fileText,
                color: currentMessage.user._id === 1 ? "white" : "black",
              }}
            >
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.primary,
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
            fontFamily: "AvenirNextCyr-Thin",
          },
          left: {
            fontFamily: "AvenirNextCyr-Thin",
          },
        }}
      />
    );
  };

  //custom scrool to bottom component
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#000" />;
  };

  const uploadFile = (filebase64, mimeType) => {
    let filetype = mimeType.split("/").pop();
    console.log("upload vfile mime type is", mimeType);
    console.log("upload file type is", filetype);
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    //changed
    //.var raw = "{\n    \"__note_file__\": \"" + signBase64 + "\",\n    \"__note_filename__\": \"" + "OrderReciept" + returnId  + "\"\n    }\n";
    var raw = JSON.stringify({
      __file_name__: `${Date.now()}.${filetype}`,
      __user_id__: token,
      __pdf_base64__: filebase64,
      __file_ext__: filetype,
      __file_mime_type__: mimeType,
    });
    console.log("file api ", raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://dev.ordo.primesophic.com/set_chatfile.php", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        //console.log("Signature Uploaded", result);
        console.log("file upload api res", res);
        fileInfo.current = {
          name: `${Date.now()}.${filetype}`,
          type: filetype,
          file_id: res?.id,
        };
        setLoading(false);
      })
      .catch((error) => console.log("file upload error", error));
  };

  // docuemnt picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.csv,
          DocumentPicker.types.images,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
        copyTo: "documentDirectory",
        mode: "import",
      });
      let uri = result[0].uri;

      console.log("document res size", result[0].size);
      //checking image size < 10 mb
      if (!checkImageSize(result[0].size)) {
        Alert.alert("Warning", "Please upload document below 10 MB");
        return;
      }
      let file = result[0];
      let path = await normalizePath(uri);
      console.log("normalized path", path);
      let filebase64 = await RNFetchBlob.fs.readFile(path, "base64");

      let tmpType = result[0].name.split(".").pop();
      console.log("selected type", tmpType);

      //uplaoding file to api
      uploadFile(`data:application/${tmpType};base64,${filebase64}`, tmpType);
      //console.log(filebase64)
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log("File URI is undefined or null");
        return;
      }
      if (
        fileUri.indexOf(".png") !== -1 ||
        fileUri.indexOf(".jpg") !== -1 ||
        fileUri.indexOf(".jpeg") !== -1 ||
        fileUri.indexOf(".heic") !== -1
      ) {
        console.log("file uri", fileUri);
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath({
          ...filePath,
          name: `${Date.now()}.${tmpType}`,
          path: fileUri,
          type: tmpType,
        });
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled file picker");
      } else {
        console.log("DocumentPicker err => ", err);
        throw err;
      }
    }
  };
  //removie prefix form path url for ios only (to remove "file://" prefix)
  const normalizePath = async (path) => {
    const filePrefix = "file://";
    if (path.startsWith(filePrefix)) {
      path = path.substring(filePrefix.length);
      try {
        path = decodeURI(path);
      } catch (e) {
        console.log("file decored error", e);
      }
    }
    return path;
  };

  // custom chat footer
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image
            source={{ uri: imagePath }}
            style={{ height: 75, width: 75 }}
          />
          <TouchableOpacity
            onPress={() => setImagePath("")}
            style={styles.buttonFooterChatImg}
          >
            <View style={{ justifyContent: "space-between", flex: 1 }}>
              <Entypo
                name="cross"
                size={20}
                style={{ marginLeft: 5 }}
                color="black"
              />
              <TouchableOpacity onPress={sendDocument}>
                <Text style={styles.send}>Send document</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath.path && filePath.name && filePath.type) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer
            filePath={filePath.path}
            name={filePath.name}
            type={filePath.type}
            send={sendDocument}
          />
          <TouchableOpacity onPress={() => setFilePath("")}>
            <Entypo
              name="cross"
              size={20}
              style={{ marginLeft: 10 }}
              color="black"
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);

  //check permssiosaon
  const checkPermission = async () => {
    let PermissionDenied = await cameraPermission();
    if (PermissionDenied) {
      console.log("camera permssion granted");
      camera();
    } else {
      console.log("camera permssion denied");
      //requestStoragePermission();
    }
  };

  const imageResize = async (item, type) => {
    ImageResizer.createResizedImage(item, 500, 500, "JPEG", 100)
      .then((response) => {
        //setting image uri
        console.log("image resize", response);
        // //checking image is < 2MB
        if (!checkImageSize(response.size)) {
          Alert.alert("Warning", "Please upload image below 10 MB");
          return;
        }
        //converting image into base 64
        RNFS.readFile(response.path, "base64").then((res) => {
          //console.log('base64', res);
          //uploadImage(res)
          console.log("resize image base64", res);
          //uploading image to server
          uploadFile(`data:${type};base64,${res}`, type);
          //console.log("updated")
          setImagePath(`data:${type};base64,${res}`);
          setIsAttachImage(true);
          //setBase64img(`data:${type};base64,${res}`);
        });
        //upload(response.uri);
      })
      .catch((err) => {
        console.log("image resize error :", err);
      });
  };

  //open camera function
  const camera = async () => {
    try {
      launchCamera({
        mediaType: "photo",
        includeBase64: true,
      }).then((res) => {
        try {
          console.log("img", res);
          if (res.didCancel) {
            console.log("user closed camera");
            return;
          }
          if (res.error) {
            console.log("image picker error");
            return;
          }
          let fileUri = res.assets[0].uri;
          if (!fileUri) {
            console.log("File URI is undefined or null");
            return;
          }
          if (
            fileUri.indexOf(".png") !== -1 ||
            fileUri.indexOf(".jpg") !== -1 ||
            fileUri.indexOf(".jpeg") !== -1
          ) {
            // console.log("file uri", fileUri);
            // fileInfo.current = {
            //     name: res.assets[0].fileName,
            //     type: res.assets[0].type,
            //     base64: `data:${res.assets[0].type};base64,${res.assets[0].base64}`

            // }
            console.log("setting loading true");
            console.log("og type", res.assets[0].type);
            imageResize(res.assets[0].uri, res.assets[0].type);
          }
        } catch (error) {
          console.log("error", error);
        }
      });
    } catch (error) {
      console.log("camera error", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} color="#000" />
        </TouchableOpacity>
        <Image
          style={styles.imageStyle}
          source={{ uri: item?.profile_image }}
        />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <ProgressDialog
        visible={loading}
        title="Uploading file"
        message="Please wait..."
        titleStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 }}
        messageStyle={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 14 }}
      />
      <ProgressDialog
        visible={loading2}
        title="Downloading file"
        message="Please wait..."
        titleStyle={{ fontFamily: "AvenirNextCyr-Medium", fontSize: 16 }}
        messageStyle={{ fontFamily: "AvenirNextCyr-Thin", fontSize: 14 }}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user_id,
        }}
        renderBubble={renderbubble}
        renderSend={renderSend}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderChatFooter={renderChatFooter}
        renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
      />
    </View>
  );
};

export default Chat;

function newFunction() {
  return "center";
}
