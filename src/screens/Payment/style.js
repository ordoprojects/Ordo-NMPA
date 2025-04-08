import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    headercontainer: {
        paddingTop: 6,
        marginHorizontal:16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
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
    
    
})