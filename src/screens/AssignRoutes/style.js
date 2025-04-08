import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import { ms, hs, vs } from '../../utils/Metrics'

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '5%',
        backgroundColor: '#fff'
    },
    headercontainer: {
        paddingTop: 6,
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
        height: '7%',
        borderColor: '#cecece',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: '6%',
        marginTop:'2%',
        backgroundColor:'white'
    },
    dropdownSD: {
        height: '7%',
        borderColor: '#cecece',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: '2%',
        // marginTop:'2%',
        backgroundColor:'white',

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
        color:'#cecece'
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
        color:'#cecece'

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
        marginVertical: '10%',
        borderRadius: 30
    },
    btnText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16
    },

    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
  
        elevation: 2,
      },
      textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
      },

      label1: {
        fontSize: 16,
        color: Colors.primary,
        fontFamily: 'AvenirNextCyr-Medium',
        marginTop:5
    },
    button1: {
        height: vs(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ms(5),
        // backgroundColor: Colors.primary,
        marginBottom: '3%',
        marginTop: '3%',
        borderRadius: 50
    },
    btnText1: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: '#fff',
        fontSize: 16,
    },
    dropdownItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
      },
      dropdownItemText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'black',
      },
      inputContainer: {
        borderColor: '#cecece',
        borderWidth: 1,
        backgroundColor: 'white',
        // height: 40,
        marginBottom: 5,
        fontFamily: 'AvenirNextCyr-Thin',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius:10,
        // height:'58%',
// width:'100%'
    },
    input2: {
        fontFamily: 'AvenirNextCyr-Thin',
        padding: 8,
        flex: 1,

    },
    labelText: {
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.primary,
        fontSize: 16,
    },
    textInput: {
        borderColor: '#dedede',
        borderWidth: 1,
        backgroundColor: 'white',
        height: 45,
        marginBottom: '4%',
        padding: 5,
        paddingLeft: 8,
        

        fontFamily: 'AvenirNextCyr-Thin',
        borderRadius: 10
    },

})