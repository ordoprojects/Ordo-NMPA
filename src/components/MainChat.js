import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, BackHandler, KeyboardAvoidingView, Platform } from "react-native";
import Voice from '@react-native-voice/voice';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BpWidget from "./Botpress/BpWidget";
import BpIncommingMessagesListener from "./Botpress/BpIncommingMessagesListener";
import { useNavigation } from '@react-navigation/native';

const testingConfig = {
  composerPlaceholder: "Chat with OrDo Assistant",
  // botId: "753e94f5-a8a8-4fb6-a34f-0534498aa84f",
  botId: "9f21c514-a670-4689-86d9-c80d4654a3fc",
  hostUrl: "https://cdn.botpress.cloud/webchat/v1",
  messagingUrl: "https://messaging.botpress.cloud",
  clientId: "9f21c514-a670-4689-86d9-c80d4654a3fc",
  lazySocket: true,
  frontendVersion: "v1",
  showPoweredBy: false,
  hideWidget: true,
  disableAnimations: true,
  closeOnEscape: false,
  showConversationsButton: true,
  enableTranscriptDownload: false,
  className: "webchatIframe",
  containerWidth: "100%25",
  layoutWidth: "100%25",
  showCloseButton: true,
  enableConversationDeletion: true,
  botName: "OrDo Assistant",
  userData: "a1b2c3d4",

};

const MainChat = () => {
  const [voiceResults, setVoiceResults] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const botpressWebChatRef = useRef();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate a delay of 1 second (remove this in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false); // Once data is fetched, set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error if needed
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();

    // Add event listener for hardware back button on Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Perform navigation action when back button is pressed
        navigation.goBack();
        return true; // Prevent default back button behavior
      }
    );

    // Clean up event listener when component unmounts
    return () => backHandler.remove();
  }, []);


  const sendExampleEvent = async () => {
    await botpressWebChatRef.current?.sendEvent({ type: "toggle" });
  }
  const sendExamplePayload = async (voiceResults) => {
    await botpressWebChatRef.current?.sendPayload({ type: "text", text: voiceResults });
  }
  const changeExampleConfig = () => {
    botpressWebChatRef.current?.mergeConfig({ botName: Math.random() });
  }

  const handleVoiceInput = async () => {
    try {
      setRecording(true)
      Voice.start();
    } catch (error) {
      console.error('Error starting voice input:', error);
    }
  };

  const releaseVoiceInput = async () => {
    try {
      Voice.stop();
      setRecording(false);
      if (voiceResults) {
        sendExamplePayload(voiceResults);
        setVoiceResults('')

      }
    } catch (error) {
      console.error('Error starting voice input:', error);
    }
  };

  Voice.onSpeechResults = (e) => {
    setVoiceResults(e.value[0]);

  };


  return (
    //  <View style={{ flex: 1, flexDirection: "column"  }}>

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust this value as needed
    >
      {loading ? ( // Display activity indicator if loading is true
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'red', width: "100%" }}>

          <BpWidget
            ref={botpressWebChatRef}
            botConfig={testingConfig}
            onMessage={(event) => {
              console.log("event from widget", event);
            }}
          />
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>



        <View style={{ padding: '5%', flex: 2 }}>
          {voiceResults ? <Text style={{ fontSize: 16 }}>
            {voiceResults}
          </Text> : (recording ? (<Text>
            Listening...
          </Text>) : (<Text>
            Hold to record, release to send
          </Text>))

          }
        </View>

        <TouchableOpacity
          style={{ backgroundColor: 'blue', width: 50, height: 50, borderRadius: 25, marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center', }}
          onPressIn={handleVoiceInput}
          onPressOut={releaseVoiceInput}

        >

          <FontAwesome name="microphone" color="white" size={20} />
        </TouchableOpacity>





      </View>



      {/* In case your webchat is not rendered and you want to catch bot messages */}
      <BpIncommingMessagesListener
        botConfig={testingConfig}
        onBotMessage={(event) => {
          console.log("bot message", event);
        }}
      />
    </KeyboardAvoidingView>
  );
}

export default MainChat;