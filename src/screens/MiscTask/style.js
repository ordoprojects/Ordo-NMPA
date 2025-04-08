import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
export default StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 12,
        // backgroundColor: '#fff'
    },
    headercontainer: {
        paddingTop: 6,
        marginHorizontal:16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    header: {
        flexDirection: 'row',
        height: 50,
        padding: 15,
        paddingBottom: 5,
        marginVertical: 5,
        justifyContent: 'space-between'

    },
    headerTitle: {
        fontSize: 18,
         fontFamily: "AvenirNextCyr-Medium",
        color: Colors.black,
        marginLeft: 10,
        marginTop: 3
    },
    value: {
         fontFamily: "AvenirNextCyr-Medium",
        color: 'grey'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: Colors.black,
         fontFamily: "AvenirNextCyr-Medium",
    },
    text2: {
        fontSize: 20,
        color: Colors.black,
         fontFamily: "AvenirNextCyr-Medium",
    },
    planHeading: {
        color: 'black',
        fontSize: 16,
         fontFamily: "AvenirNextCyr-Medium",
        marginVertical: 3
    },
    title: {
        fontSize: 14,
        color: Colors.primary,
         fontFamily: "AvenirNextCyr-Medium",
        textTransform: 'capitalize'

    },
    itemContainer: {
        marginTop: 10,
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        padding: '2%',
        borderColor: Colors.white,
        marginBottom: 5,
        flex:1

    },
    orderDataContainer: {
        // paddingHorizontal: 10,
        flexDirection: 'row',
        flex:1
    },
    rowContainer: {
        marginVertical: 3
    },
    heading: {
        color: '#000',
         fontFamily: "AvenirNextCyr-Medium",
        fontSize: 14,
    },
    value: {
        color: 'black',
         fontFamily: "AvenirNextCyr-Medium"
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
         fontFamily: "AvenirNextCyr-Medium"
    },
    noReport: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noReportText: {
        fontSize: 16,
        color: Colors.black,
         fontFamily: "AvenirNextCyr-Medium"
    },
    buttonTextStyle: {
        color: '#fff',
         fontFamily: "AvenirNextCyr-Medium",
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
        width: 100,
        height: 90,
        resizeMode: 'cover',
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 5
    },
    photosContainer: {
        height: 40,
        padding: 10,
        borderRadius: 10,
      },
    cNameTextInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B3B6B7',
        padding: 5,
         fontFamily: "AvenirNextCyr-Medium",
        marginBottom: 10
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
         fontFamily: "AvenirNextCyr-Medium"
    },
    buttonview: {
        flexDirection: 'row'
    },
    buttonContainer: {
        height: 50,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
         fontFamily: "AvenirNextCyr-Medium",
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
         fontFamily: "AvenirNextCyr-Medium",
        textAlignVertical: 'top',
        color: '#000'
    },
    fabStyle: {
        borderRadius: 50,
        position: "absolute",
        margin: 10,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
    },  closeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgray",
        borderRadius: 20,
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#EFF1F5",
      },
      textStyle: {
        marginLeft: 10,
      },
      circleButton: {
        width: 35,
        height: 35,
      },
      circle: {
        width: 50,
        height: 50,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      },
    
    
})