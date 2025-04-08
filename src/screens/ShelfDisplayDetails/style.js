import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
export default StyleSheet.create({
    headercontainer: {
        padding: 10,
        paddingBottom:0,
        
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3,
        // marginBottom:6
    },
    container: {
        backgroundColor: 'white',
        padding: 16,
        flex: 0.9
    },
    text: {
        fontFamily: 'AvenirNextCyr-Thin',
        fontSize:14,
        color:Colors.black
    },
    label: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonContainer: {
        height: 50,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary,
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'white'
    },
    textarea: {
        borderWidth: 0.5,
        borderColor: 'black',
        marginBottom: 10,
        borderRadius: 5,
        padding: 10,
        //fontSize: 13,
        textAlignVertical: 'top',
        color: '#000',
        fontFamily: 'AvenirNextCyr-Thin',


    },
    text: {
        fontFamily: 'AvenirNextCyr-Thin',
    },
    imgStyle: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderRadius: 8,
        //marginRight: 8, muliplr img style
    }

})