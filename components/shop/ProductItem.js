import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';

import Card from '../../components/UI/Card';

const ProductItem = (props) => {
  let TouchableCmp = TouchableOpacity;

  // if (Platform.OS === 'android' && Platform.Version >= 21) {
  //   TouchableCmp = TouchableNativeFeedback;
  // }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.imageContainer}>
            <Image source={{ uri: props.image }} style={styles.image} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            {/* <Text style={styles.price}>${props.price}</Text> */}
          </View>
          <View style={styles.actions}>{props.children}</View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    backgroundColor: 'white',
    margin: 20,
    height: 300,
  },
  touchable: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
  },
  details: { alignItems: 'center', height: '15%' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
    fontFamily: 'open-sans-bold',
  },
  price: { fontSize: 14, color: '#888', fontFamily: 'open-sans' },
});

export default ProductItem;
