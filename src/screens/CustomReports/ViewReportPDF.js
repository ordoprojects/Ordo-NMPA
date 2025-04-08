import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PDFView from 'react-native-view-pdf';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ViewReportPDF = ({ navigation, route }) => {

    const { filePath } = route.params;
    console.log("filePath", filePath);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <AntDesign name='arrowleft' size={25} color={Colors.black} />
                    </TouchableOpacity>

                </View>
                {/* <TouchableOpacity style={{ paddingBottom: 10, marginRight: 10 }}
                    onPress={savePDFToLocal}
                >
                    <Image source={require('../../assets/images/download.png')} style={{ height: 30, width: 30, tintColor: Colors.primary, marginRight: 10 }} />
                </TouchableOpacity> */}
            </View>


            <PDFView
                fadeInDuration={250.0}
                style={{ flex: 1 }}
                resource={filePath}
                resourceType={'file'}
                onLoad={() => console.log(`PDF rendered from filePath`)}
                onError={(error) => console.log('Cannot render PDF', error)}
            />

        </View>
    )
}

export default ViewReportPDF