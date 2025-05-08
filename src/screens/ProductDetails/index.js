import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {FadeInLeft} from 'react-native-reanimated';
import globalStyles from '../../styles/globalStyles';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';

const ProductDetails = ({navigation, route}) => {
  const {item} = route.params;
  console.log("🚀 ~ ProductDetails ~ item:", item)
  const width = Dimensions.get('window').width;
  const [activeSlide, setActiveSlide] = useState(0);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    //repalcing ' and " values in description
    if (item.description !== null) {
      let sQuote = item.description.replaceAll('&#039;', "'");
      let dQuote = sQuote.replaceAll('&quot;', '"');
      setDesc(dQuote);
    } else {
      setDesc(null);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{...styles.headercontainer}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <Text></Text>
      </View>

      <View style={{marginVertical: '4%',flex:0.4}}>
      <Carousel
  loop
  width={width}
  height={width / 2}
  autoPlay={true}
  data={
    item?.product_image
      ? [item.product_image.startsWith('http')
          ? item.product_image
          : `https://gsidev.ordosolution.com${item.product_image}`]
      : [require("../../assets/images/noImagee.png")]
  }
  scrollAnimationDuration={1000}
  pagingEnabled={true}
  onSnapToItem={(index) => setActiveSlide(index)}
  renderItem={({ item: image }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.Image
        sharedTransitionTag="shared"
        source={typeof image === 'string' ? { uri: image } : image}
        style={{ width: 200, height: 200, resizeMode: "contain" }}
      />
    </View>
  )}
/>

      </View>

      <View style={styles.itemDescriptionView}>
        <ScrollView>
          <View
            style={{
              marginTop: '2%',
              alignContent: 'center',
              backgroundColor: 'white',
              borderRadius: 11,
              paddingHorizontal: '4%',
              gap: 5,
              paddingVertical: '3%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginRight:'4%'
              }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={{...styles.rupees}}>
                {item.currency} {Number(item.product_price)}{' '}
              </Text>
            </View>

            <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}>
              {desc}
            </Text>
          </View>

          <View style={styles.itemContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/productBP.png')}
                style={{height: 30, width: 30}}
              />
              <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
                Total Stock
              </Text>
            </View>

            <View style={styles.colonStyle}>
              <Text>:</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}>{item.available_stock}</Text>
            </View>
          </View>

          <View style={styles.itemContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/productHSN.png')}
                style={{height: 30, width: 30}}
              />
              <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
                HSN
              </Text>
            </View>

            <View style={styles.colonStyle}>
              <Text>:</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}>{item.hsc_code}</Text>
            </View>
          </View>

          <View style={styles.itemContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/ProductRetail.png')}
                style={{height: 30, width: 30}}
              />
              <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
                Retail Price
              </Text>
            </View>

            <View style={styles.colonStyle}>
              <Text>:</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}>{Number(item.product_price)}</Text>
            </View>
          </View>

          <View style={styles.itemContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/productTax.png')}
                style={{height: 30, width: 30}}
              />
              <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
                Tax
              </Text>
            </View>

            <View style={styles.colonStyle}>
              <Text>:</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}} >{Number(item.product_tax).toFixed(0)}%</Text>
            </View>
          </View>

          <View style={styles.itemContainer}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../assets/images/productCat.png')}
                style={{height: 30, width: 30}}
              />
              <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
                Product Category
              </Text>
            </View>

            <View style={styles.colonStyle}>
              <Text>:</Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}> {item.product_category?.product_category_name}</Text>
            </View>
          </View>

   {item?.product_uom_stock?.map((uom, index) => {
  const uomKey = Object.keys(uom)[0];
  const uomValue = uom[uomKey];
  return (
    <View style={styles.itemContainer} key={index}>
      <View style={styles.titleContainer}>
        <Image
          source={require('../../assets/images/productBP.png')}
          style={{height: 30, width: 30}}
        />
        <Text style={{fontFamily: 'AvenirNextCyr-Bold', color: 'black'}}>
          {uomKey}
        </Text>
      </View>

      <View style={styles.colonStyle}>
        <Text>:</Text>
      </View>

      <View style={styles.itemInfo}>
        <Text style={{fontFamily: 'AvenirNextCyr-Medium', color: 'black'}}>
          {uomValue ? parseFloat(uomValue).toFixed(3) : 0}
        </Text>
      </View>
    </View>
  );
})}

        </ScrollView>
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageView: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: '5%',
    marginHorizontal: '5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quantityButtonView: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'white',
    height: 45,
    width: 50,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityCountView: {
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'white',
    height: 45,
    width: 100,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'AvenirNextCyr-Medium',
    fontSize: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'AvenirNextCyr-Bold',
    color: 'black',
    width: '88%',
  },
  text: {
    color: 'black',
    fontWeight: '500',
  },
  rupees: {
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Medium',
    color: '#1FA942',
    fontWeight: '700',
  },
  description: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'black',
  },
  content: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'black',
    marginBottom: 20,
  },
  items: {
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Bold',
    color: 'black',
  },
  stock: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'black',
  },

  itemDescriptionView: {
    flex: 1,
    backgroundColor: '#f3f3f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    ...globalStyles.border,
    padding: 10,
  },
  headercontainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'AvenirNextCyr-Medium',
    color: Colors.black,
    marginTop: 3,
    fontWeight: '600',
  },
  value: {
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'grey',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '5%',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    paddingVertical: '2%',
  },

  titleContainer: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  colonStyle: {
    flex: 1,
    alignItems: 'center',
    fontWeight: 700,
    fontSize: 16,
    color: 'black',
  },

  itemInfo: {
    flex: 1,
    alignItems: 'flex-end',
    fontFamily: 'AvenirNextCyr-Medium',
    color: 'black',
  },

  paginationContainer: {
    position: 'relative',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8, 
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
});
