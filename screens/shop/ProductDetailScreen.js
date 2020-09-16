import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import DefaultButton from '../../components/UI/DefaultButton';
import Layout from '../../util/Layout';
import Title from '../../components/UI/Title';

import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam('productId');
  const selectedProduct = useSelector((state) => state.products.availableProducts.find((el) => productId === el.id));

  const dispatch = useDispatch();

  return (
    <Layout>
      <ScrollView>
        <Title>{selectedProduct.title}</Title>
        <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
        <View style={styles.actions}>
          <DefaultButton mode='contained' onPress={() => dispatch(cartActions.AddToCart(selectedProduct))}>
            Add to Cart
          </DefaultButton>
        </View>
        <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
        <Text style={styles.description}>{selectedProduct.description}</Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans',
  },
});

ProductDetailScreen.navigationOptions = (navData) => {
  const productTitle = navData.navigation.getParam('productTitle');

  return {
    // headerTitle: productTitle,
  };
};

export default ProductDetailScreen;
