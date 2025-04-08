import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import globalStyles from '../../styles/globalStyles'
export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#fff'
    },
    headercontainer: {
        paddingTop: 6,
        // marginHorizontal: 16,
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
        marginVertical: 3,
        backgroundColor: 'white',

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

        padding: '3%',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'

    },
    boxText: {
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black'
    },

    container: {
        backgroundColor: 'white',
        padding: 16,
        flex: 1
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: '2%'
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    button: {
        paddingVertical: '3%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary,
        marginTop: '5%',
        borderRadius: 30
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },

    minusButton: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 10
    },
    modalMinusButton: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 10
    },
    quantityCount: {
        width: 45,
        height: 30,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 30,
        marginLeft: 1
    },
    modalQuantityCount: {
        width: 35,
        height: 20,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginTop: 40,
        marginLeft: 1
    },
    orderCloseView: {
        height: 15,
        width: 15,
        //marginTop: 30
    },
    imageText: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,

        //paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
    },
    searchButton: {
        padding: 5,
    },
    sendButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,

        height: 40,
        marginLeft: 10
    },
    saveButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    deleteButtonView: {
        borderRadius: 5,
        // borderWidth: 1,
        // borderColor: 'grey',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10
    },
    addButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 40,
        marginLeft: 10,
        alignSelf: 'center'
    },
    modalAddButtonView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 35,
        //alignSelf: 'flex-end',
        //marginLeft: 30,
        //marginTop: 60
    },
    buttonText: {
        color: 'blue',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    sendButton: {
        color: 'white',
        fontFamily: 'AvenirNextCyr-Thin'
    },
    deleteButton: {
        color: 'red'
    },
    saveButton: {
        color: 'purple'
    },
    textColor: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium',
    },
    textValue: {
        color: 'black',
        fontFamily: 'AvenirNextCyr-Thin',
    },
    searchModal: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        ...globalStyles.border,
        //borderColor: 'black',
        //borderWidth: 1,
        marginVertical: 100
        // flexDirection:'row'
    },
    modalSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        flex: 1,
        height: 45
    },
    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    imageView: {
        width: 80,
        height: 80,
        // borderRadius: 40,
        // marginTop: 20,
        // marginBottom: 10
    },
    elementsView: {
        backgroundColor: "white",
        margin: 5,
        //borderColor: 'black',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        marginBottom: 16,
        borderRadius: 8,
        elevation: 5,
        ...globalStyles.border,
        padding: 16
        //borderColor: '#fff',
        //borderWidth: 0.5
    },
    inputContainer1: {
        borderColor: '#b3b3b3',
        color: 'gray',
        borderWidth: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        padding: 5,
      },
      input2: {
        fontFamily: 'AvenirNextCyr-Medium',
        padding: 8,
        marginLeft: '4%'
      },
    

})