// email validation
export const emailValidation = (email) => {
    const expression = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return expression.test(String(email).toLowerCase())
}
// checking data is empty
export const isEmpty = (val) => {
    if (val.trim().length === 0) {
        return true;
    }
    else {
        return false
    }
}
// checking max chars for input field
export const phoneNumberValidation = (val) => {

    if (val.trim().length === 10) {
        //console.log('inisde func')
        return true;
    }
    else {
        return false
    }

}


// // exporting pdf data
// export const pdfData = (array) => array.map((item, index) =>
//     `<tr>
// <td><center>${++index}</center></td>
// <td><center>${item.first_name}</center></td> 
// <td><center>${item.last_name}</center></td> 
// <td ><center>${item.email}</center></td>
// <td ><center>${item.phone}</center></td>
// <td><center><img src=${item.image} alt="no img" width="30" height="30"></center></td>

// </tr>`
// ).join(''); //join method -> to print array elements without comma separator

// // // open file method
// // import FileViewer from "react-native-file-viewer";
// // //method to open pdf file
// // export const openFile = (filepath) => {
// //     const path = filepath;
// //     FileViewer.open(path)
// //         .then(() => {
// //             // success
// //         })
// //         .catch(error => {
// //             // error
// //             Alert.alert("Sorry Couldn't find apps to open this file")
// //         });
// // }

import { Alert, PermissionsAndroid, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions"
import Geolocation from 'react-native-geolocation-service';

//method to request storage permssion in android 
// export const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//         try {
//             // Ask for storage permission
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.CAMERA,
//                 {
//                     title: "camera permission needed",
//                     buttonNeutral: "Ask Me Later",
//                     buttonNegative: "Cancel",
//                     buttonPositive: "OK"
//                 }
//             );
//             // If WRITE_EXTERNAL_STORAGE Permission is granted
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//             console.warn(err);
//             alert('Error While Checking Permission', err);
//         }
//         return false;
//     } else return true;
// };



export const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission Needed",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            Alert.alert('Error While Checking Permission', err.message);
        }
        return false;
    } else return true;
};

import { BASE_URL } from "../constants/Const";
// method to fetch data from api
export const fetchData = async (userToken, title, search_query) => {
    var url;
    if (search_query == null) {
        url = `${BASE_URL}/${title}/`
    }
    else {
        url = `${BASE_URL}/${title}/${search_query}/`
    }

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'autherization': userToken
        }
    })
        .then((response) => response.json())
        .then((json) => {
            //returning json receive array
            return json.responseData;
        })
        .catch((error) => {
            console.error(error);
        });
}

//user token method
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getAcessToken = async () => {
    return await AsyncStorage.getItem('userToken');

}

export const locationPermission = () => new Promise(async (resolve, reject) => {
    console.log('OS : ', Platform.OS)
    if (Platform.OS === 'ios') {
        try {
            console.log('ios');
            const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
            if (permissionStatus === 'granted') {
                return resolve("granted");
            }
            reject('ios Permission not granted');
        } catch (error) {
            return reject(error);
        }
    }
    else {
        console.log('android');
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                resolve("granted");
            }
            return reject('android Location Permission denied');
        }).catch((error) => {
            console.log('Ask Location permission error: ', error);
            return reject(error);
        });
    }
});

// Request camera permission
export const cameraPermission = async () => {
    try {
        if (Platform.OS === 'ios') {
            const permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            if (permissionStatus === RESULTS.GRANTED) {
                return true;
            } else {
                Alert.alert('Permission Denied', 'Camera permission not granted');
                return false;
            }
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                Alert.alert('Permission Denied', 'Android camera permission denied');
                return false;
            }
        }
    } catch (error) {
        console.error('Camera permission error:', error);
        Alert.alert('Permission Error', `Error requesting camera permission: ${error.message}`);
        return false;
    }
};

export const checkImageSize = (size) => {
    let maxsize = 10 * 1024 * 1024; //10 mb
    if (size < maxsize) {
        return true;
    }

}










