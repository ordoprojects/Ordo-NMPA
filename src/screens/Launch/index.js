import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Animated,
  useWindowDimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { hs, vs, ms } from '../../utils/Metrics';
import Swipeable from 'react-native-gesture-handler/Swipeable';


const Launch = ({ navigation }) => {

  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  const headlines = [
    { title: 'Welcome to OrDo', content: 'Stay connected with your customers and vendors' },
    { title: 'Explore Features', content: 'Discover powerful tools to streamline your business' },
    { title: 'Connect with OrDo', content: 'Join our community and connect with other businesses worldwide' },
    { title: 'Get Started Now', content: 'Join OrDo today and experience the future of business management' },
  ];

  return (
    <View style={styles.container}>

       <ImageBackground
        source={require('../../assets/images/WaveNew.png')} // Replace with the actual path to your image
        style={styles.backgroundImage}
      >  
    
        <ScrollView
          horizontal={true}
          pagingEnabled
          disableIntervalMomentum={true}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ])}
          scrollEventThrottle={1}
        >
          <Image source={require('../../assets/images/LuanchScreen.png')}
            style={styles.vector}
          />

        </ScrollView>

        <View style={styles.contentContainer}>

          <ScrollView
            horizontal={true}
            pagingEnabled
            disableIntervalMomentum={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ])}
            scrollEventThrottle={1}
          >
            {headlines.map((item, imageIndex) => {
              return (
                <View style={{ width: windowWidth, height: 250 }} key={imageIndex}>

                  <View style={styles.textContainer}>
                    <Text style={[styles.infoText, { fontFamily: 'AvenirNextCyr-Medium', fontSize: ms(25) }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.infoText, { fontFamily: 'AvenirNextCyr-Medium', fontSize: ms(17),marginTop:5}]}>
                      {item.content}
                    </Text>
                  </View>

                </View>
              );
            })}
          </ScrollView>

          <View style={{ flexDirection: 'row', marginTop: '5%', alignItems: 'center', position: 'absolute', right: '5%' }}>
            <TouchableOpacity
              onPress={() => { navigation.navigate('Login') }}
              style={styles.button}>
              <Text style={{ color: 'black', fontFamily: 'AvenirNextCyr-Medium', fontSize: ms(15), }}>Get Started</Text>
              <AntDesign name='right' size={ms(18)} color="black" />

            </TouchableOpacity>
          </View>

          <View style={styles.indicatorContainer}>
            {headlines.map((item, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [8, 16, 8],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[styles.normalDot, { width }]}
                />
              );
            })}
          </View>
        </View>

{/* 
        <Image
        source={require("../../assets/images/wavedown1.png")}
        style={styles.backgroundImage}
      /> */}


      </ImageBackground>
    </View>
  );
};
export default Launch;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6eeff',
  },
  backgroundImage: {
  
  // zIndex:-1,
  width:'100%',
  height:'100%',
resizeMode:'cover'    
  },
  vector: {
    width: ms(300),
    // height: ms(280),
    height:"40%",
    borderRadius:100,
    marginTop: '6%',
  },
  contentContainer: {
    // paddingHorizontal: '5%',
    position: 'absolute',
    top: '67%',
    width: '100%',
    // backgroundColor: 'red',
    height: '50%',
    justifyContent: 'center'


  },
  button: {
    backgroundColor: 'white',
    width: hs(130),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(30),
    paddingVertical: '2%',
    flexDirection: 'row',
    gap: hs(5)
    // paddingHorizontal: '5%'
  },
  WelcomeText: {
    color: 'white',
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: ms(29)
  },

  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    // backgroundColor: 'rgba(0,0,0, 0.7)',
    paddingHorizontal: '7%',
    paddingVertical: 30,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',

  },

  normalDot: {
    height: vs(8),
    width: hs(8),
    borderRadius: ms(4),
    backgroundColor: 'silver',
    marginHorizontal: hs(4),
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '7%'
  },


});