import { StyleSheet, Dimensions } from "react-native";
import globalStyles from '../../styles/globalStyles';
import Colors from "../../constants/Colors";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        // backgroundColor: '#f1f1f2'
        backgroundColor: 'white',
    },
    container: {
        // margin: '3%',
        flex: 1
    },
    checkOutView: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        paddingVertical:'2%',
        paddingHorizontal:'2%'
       
        // flex:1
    },
    ButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: '4%',
    },
    ButtonContainer:
    {
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 8,
        width: '30%',
        // height:'80%',
        // paddingHorizontal: 10,
        padding: 10,
        elevation: 9,
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 }, // iOS shadow
        shadowOpacity: 0.2, // iOS shadow
        shadowRadius: 4, // iOS shadow
        justifyContent: 'center',
        alignItems: 'center'
    },
    ButtonContainer1:
    {
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 8,
        width: '20%',
        // height:'80%',
        // paddingHorizontal: 10,
        padding: 10,
        elevation: 9,
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 }, // iOS shadow
        shadowOpacity: 0.2, // iOS shadow
        shadowRadius: 4, // iOS shadow
        justifyContent: 'center',
        alignItems: 'center'
    },
    ProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent:'space-around'
    },
    ProductContainer: {
    },
    SearchContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: '1%',
        paddingHorizontal: 5,
    },
    SearchBox: {
        //borderBottomWidth:1,
        borderBottomColor: '#cccccc',
        flex: 1,
    },
    ProductListContainer: {
        flex: 1,
        marginVertical: '4%',
    },
    noProductsContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noProductsText: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'AvenirNextCyr-Thin',
        textAlign: 'center',
        marginTop: 80,
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


    //   modalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',

    // },

    // modalContent: {
    //     backgroundColor: 'white',
    //     padding: '5%',
    //     borderRadius: 10,
    //     // alignItems: 'center',
    //     height:'100%',
    //     borderWidth:0.5,
    //     paddingVertical:'3%'

    // },

    // ModalHeader:{
    //     flexDirection:'row',
    //     justifyContent:'space-between',
    //     alignItems:'center'
    // },
    // modalText: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    // modalButtons: {
    //     flexDirection: 'row',
    // },
    // modalButton: {
    //     flex: 1,
    //     padding: 10,
    //     margin: 10,
    //     borderRadius: 5,
    //     alignItems: 'center',
    // },
    // modalButtonText: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: 'white',
    // },
    // modalCancelButton: {
    //     backgroundColor: 'gray',
    // },
    // modalSendButton: {
    //     backgroundColor: Colors.primary
    // },

    // costText:{
    //     justifyContent:'flex-end', 
    //     flexDirection:'row',
    //     marginRight:'4%',
    //     marginVertical:5,
    // }

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: windowWidth * 0.05,
        borderRadius: windowWidth * 0.0333,
        height: '100%',
        borderWidth: 0.5,
        paddingVertical: windowHeight * 0.03,
    },
    ModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: windowHeight * 0.03,
    },
    modalText: {
        fontSize: windowWidth * 0.06,
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        flex: 1,
        padding: windowWidth * 0.03,
        // marginHorizontal: windowWidth * 0.02,
        borderRadius: windowWidth * 0.027,
        alignItems: 'center',
        marginVertical: '5%'
    },
    modalButtonText: {
        fontSize: windowWidth * 0.05,
        fontWeight: 'bold',
        color: 'white',
    },
    modalCancelButton: {
        backgroundColor: 'gray',
    },
    modalSendButton: {
        backgroundColor: Colors.primary,
    },
    costText: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginRight: '4%',
        // marginVertical: windowHeight * 0.01,
    },
    signature: {
        flex: 1,
        borderColor: '#00003',
        borderWidth: 1,

    },

    modalTitle: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'AvenirNextCyr-Medium'
    },



    content: {
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Thin',
        color: 'black',
    },
    checkOutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        backgroundColor:'#F5F5F5'
    },
    checkOutBtn:{
        backgroundColor:Colors.primary,
        padding:'2%',
        borderRadius:20,
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    }




});

export default styles;