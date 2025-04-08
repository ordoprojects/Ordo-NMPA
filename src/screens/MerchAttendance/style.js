import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import globalStyles from '../../styles/globalStyles'
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 16
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        alignItems:'center'
    },
    nameText: {
        fontSize: 18,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium',
        textTransform: 'capitalize'
    },
    dateText: {
        //color:Colors.grey,
        fontSize: 14,
        fontFamily: 'AvenirNextCyr-Thin'
    },
    title: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginTop: 10
    },
    attendanceView: {
        marginVertical: 10,
        borderRadius: 8,
        borderLeftColor: Colors.primary,
        borderLeftWidth: 10,
        flexDirection: 'row',
        backgroundColor: '#F4F5FA',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingRight:45,
   


    },

    dateViewContainer: {
        marginRight: 12
    },
    dateValStyle: {
        fontSize: 20,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    month: {

        color:Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    weekNameTextStyle: {
        fontFamily: 'AvenirNextCyr-Medium',
        fontSize: 14,
        color: Colors.black,


    },
    place: {
        fontSize: 14,
        marginTop: 3,
        fontFamily: 'AvenirNextCyr-Thin',
        color: '#5A5A5A',
        


    },
    clockInContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 5,
        ...globalStyles.border,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        //marginTop:10

    },
    buttonStyle: {
        height: 50,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary

    },
    headerTitle: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: 'AvenirNextCyr-Medium',
        marginVertical: 10
    },
    buttonTextStyle: {
        fontSize: 16,
        color: Colors.white,
        fontFamily: 'AvenirNextCyr-Medium',

    },
    name:{
        fontSize:14,
        fontFamily:'AvenirNextCyr-Medium',
        color:Colors.black

    },
    headercontainer2: {
        padding: 10,
        paddingLeft:0,
        //backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',

    },
    headerTitle2: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    value: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'grey'

    }

})
