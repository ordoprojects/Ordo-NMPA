import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import globalStyles from '../../styles/globalStyles';
import { hs, vs, ms } from '../../utils/Metrics';
import { Dimensions } from 'react-native';

// Get the screen height
const screenHeight = Dimensions.get('window').height;

// Calculate the card height dynamically
const cardHeight = screenHeight * 0.13; 


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    headercontainer: {
        paddingTop: 6,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    value: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'grey'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Thin',
    },
    planHeading: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        marginVertical: 3
    },
    title: {
        fontSize: 14,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
        textTransform: 'capitalize'

    },
    itemContainer: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.white,
        elevation: 3,
        marginBottom: 5,

    },
    orderDataContainer: {
        paddingHorizontal: 10
    },
    rowContainer: {
        //flexDirection: 'row',
        marginVertical: 3
    },
    heading: {
        color: '#000',
        fontFamily: 'AvenirNextCyr-Thin',
        fontSize: 14,
    },
    value: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    activityIndicator: {
        flex: 1,
        alignSelf: 'center',
        height: 100,
        position: 'absolute',
        top: '30%',
    },
    headerView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginTop: 10,
        marginRight: 5
    },
    planView: {
        marginLeft: 20,
        marginTop: 10
    },
    planText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    noReport: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noReportText: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    buttonTextStyle: {
        color: '#fff',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    button: {
        height: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        padding: 10

    },
    imgStyle: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 8,
        //marginRight: 8, muliplr img style
        marginTop: 5,
        marginBottom: 5

    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary,
        marginRight: 10
    },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
        fontFamily: 'AvenirNextCyr-Thin',
        marginBottom: 10
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    buttonview: {
        flexDirection: 'row'
    },
    buttonContainer: {
        heigh: 40,
        padding: 10,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: 10,
        marginVertical: 10,
        backgroundColor: Colors.primary
    },
    buttonText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'white'
    },
    textarea: {
        borderWidth: 0.5,
        borderColor: 'black',
        //margin: 15,
        marginTop: 8,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin',
        textAlignVertical: 'top',
        color: '#000'
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: '4%',
    },
    box: {
        flex:0.45,
        padding: '3%',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        

    },
    boxText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: 'black'
    },
    recoredbuttonStyle: {
        // flex:1,
        borderBottomStartRadius:25,
        borderTopEndRadius:25,
        // borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        //  marginHorizontal: 5,
        shadowRadius: 2,
        elevation: 5,
        ...globalStyles.border,
        height: cardHeight,
        // width: 118,
        // flex:1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        // marginTop: 5,
        flexDirection: 'row',
        padding:20
      
      
      },

})