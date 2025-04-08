// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { CameraScreen } from 'react-native-camera-kit';
// import Colors from '../../constants/Colors';
// const Scanner = ({ navigation }) => {
//     return (
//         <CameraScreen
//             style={{ flex: 1 }}
//             actions={{ leftButtonText: 'Cancel' }}
//             onBottomButtonPressed={() => navigation.navigate('AdminOrderCart')}
//             onReadCode={(event) => {
//                 console.log(event.nativeEvent.codeStringValue);
//                 navigation.navigate('AdminOrderCart');
//             }}
//             // Barcode props
//             scanBarcode={true}

//             showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
//             laserColor={Colors.primary} // (default red) optional, color of laser in scanner frame
//             frameColor='white' // (default white) optional, color of border of scanner frame
//         />
//     )
// }

// export default Scanner