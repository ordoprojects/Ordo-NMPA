import { StyleSheet, Text, View, Image, Modal, TouchableOpacity ,Linking} from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../constants/Colors';

const VersionModel = ({ modalVisible, closeModal }) => {
  const version = DeviceInfo.getVersion();
      
  const shareOnWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=whatsapp:/send?phone=9731641766`);
  };

  const openEmail = () => {
    const recipient = 'das@primesophictech.com';
    const subject = `OrDo GSI - ${new Date().toLocaleDateString()}`;
    const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url);
   
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Image
            source={require("./../assets/images/GSILogo.png")}
            style={styles.imageView}
          />
          <Text style={styles.versionText}>App Version: 1.10.8</Text>
          <Text style={styles.versionText1}>For any assistance or inquiries, feel free to reach out to us !!</Text>

          <View style={{flexDirection:'row',gap:30 ,alignItems:"center" ,marginVertical:'5%'}}>
          <TouchableOpacity
              style={{}} onPress={() => shareOnWhatsApp()}>
             <Image
            source={require("./../assets/images/whatsaAPP.png")}
            style={{  width: 30,
            height:30,
            resizeMode: "contain"}}
          />
            </TouchableOpacity>
            <TouchableOpacity
              style={{}} onPress={openEmail}>
             <Image
            source={require("./../assets/images/email.png")}
            style={{  width: 30,
            height:30,
            resizeMode: "contain"}}
          />
            </TouchableOpacity>
          </View>
        
          <Text style={styles.versionText11}> © 2025 inteliTech Solutions. All rights Reserve</Text>

           <TouchableOpacity
              style={styles.graycircle1} onPress={closeModal}>
              <AntDesign name="close" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VersionModel;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  imageView: {
    width: '100%',
    height:100,
    resizeMode: "contain"
  },
  versionText: {
    fontSize: 19,
    color:Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
  },
  versionText1: {
    fontSize: 10,
    color:Colors.primary,
    fontFamily: 'AvenirNextCyr-Medium',
    marginTop:'3%',
    textAlign:"center"
  },
  versionText11: {
    fontSize: 10,
    color:'gray',
    fontFamily: 'AvenirNextCyr-Medium',
    marginTop:'3%'
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },  
  graycircle1: {
    width: 30,
    height: 30,
    borderRadius: 19,
    backgroundColor: '#E7E0F0',
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:10,
    right:10
  },
});
