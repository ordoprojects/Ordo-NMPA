import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import PDFView from 'react-native-view-pdf';
import RNFS, { DownloadDirectoryPath, DocumentDirectoryPath } from 'react-native-fs';
import Share from 'react-native-share';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PDFViewer = ({ navigation, route }) => {
    const { title, url } = route.params;
    console.log("url", url);

    const savePDFToLocal = async () => {
        try {
            //file name will be current timestamp
            const downloadDest = Platform.OS === 'ios' ? `${DocumentDirectoryPath}/${Date.now()}.pdf` : `${DownloadDirectoryPath}/${Date.now()}.pdf`;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
            };

            const downloadResult = await RNFS.downloadFile(options).promise;

            if (downloadResult.statusCode === 200) {
                console.log('PDF saved to Download folder:', downloadDest);
                Alert.alert('Download', 'PDF file downloaded successfully');
                sharePDF(downloadDest); // Share the PDF after saving
            } else {
                console.log('Failed to save PDF:', downloadResult);
            }
        } catch (error) {
            console.error('Error saving PDF:', error);
        }
    };

    const sharePDF = (filePath) => {
        const options = {
            title: 'Share PDF',
            url: `file://${filePath}`, // Share the file using its URI
            type: 'application/pdf',
        };

        Share.open(options)
            .then((res) => console.log('Share success:', res))
            .catch((err) => console.log('Share error:', err));
    };

    const onError = (error) => {
        console.error('Error loading PDF:', error);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ paddingBottom: 10, marginRight: 10 }} onPress={savePDFToLocal}>
                    <Image source={require('../../assets/images/download.png')} style={{ height: 30, width: 30, tintColor: Colors.primary, marginRight: 10 }} />
                </TouchableOpacity>
            </View>
            <PDFView
                fadeInDuration={250.0}
                style={{ flex: 1 }}
                resource={url}
                resourceType={'url'}
                onLoad={() => console.log(`PDF rendered from url`)}
                onError={(error) => console.log('Cannot render PDF', error)}
            />
        </View>
    );
};

export default PDFViewer;
