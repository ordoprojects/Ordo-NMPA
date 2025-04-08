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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Medium',
        color: Colors.black,
        // marginLeft: 60,
        // marginTop: 3,
    },
     
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
    // flex:1,
    // marginLeft:52,
  
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
        fontFamily: 'AvenirNextCyr-Thin',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '90%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the modal content horizontally
      },
    
      closeIcon: {
        position: 'absolute',
        top: 0, // Set the top offset to 0 (right above the modal content)
        right: 5,
        padding: 10,
      },
      modalInnerContent: {
        marginTop: 15, // Add a margin to separate the icon from the modal content
      },
      ModalText1: {
        color: '#000000',
        textAlign: 'left',
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Medium',
        marginLeft: 1,
    
      },
      container1: {
        backgroundColor: 'white',
        padding: 16,
        width: '100%', // Adjust the width as needed, for example '90%'
        alignSelf: 'center', // Center the container horizontally within the modal
      },
    
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: '100%', // Set the desired width for the dropdown, for example '100%' to match the parent container
      },
    
      icon1: {
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
        fontFamily: 'AvenirNextCyr-Thin',
    
      },
      selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Thin',
    
      },
      submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 15,
        marginRight: 15,
      },
      submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Medium'
      },
})