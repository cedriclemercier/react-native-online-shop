import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, View, Text } from 'react-native';

import Layout from '../../util/Layout';
import ProductItem from '../../components/shop/ProductItem';
import Title from '../../components/UI/Title';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/product';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import DefaultButton from '../../components/UI/DefaultButton';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';

const ProductsOverview = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [error, setError] = useState();

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: { productId: id, productTitle: title },
    });
  };

  const loadProducts = useCallback(async () => {
    setError(null);
    setisRefreshing(true);
    try {
      await dispatch(productActions.fetchProduct());
    } catch (err) {
      setError(err.message);
    }
    setisRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const renderProduct = (itemData) => (
    <ProductItem
      image={itemData.item.imageUrl}
      title={itemData.item.title}
      price={itemData.item.price}
      onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}>
      <DefaultButton
        icon='menu'
        onPress={() => {
          selectItemHandler(itemData.item.id, itemData.item.title);
        }}
        mode='contained'>
        Details
      </DefaultButton>
      <DefaultButton icon='cart' onPress={() => dispatch(cartActions.AddToCart(itemData.item))} mode='contained'>
        Add to Cart
      </DefaultButton>
    </ProductItem>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error ocurred.</Text>
        <DefaultButton mode='contained' onPress={loadProducts}>
          Try again
        </DefaultButton>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <Layout>
      <FlatList
        // Pull to update
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListHeaderComponent={<Title>Hello, Cedric</Title>}></FlatList>
    </Layout>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ProductsOverview.navigationOptions = (navData) => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Cart'
          iconName='shoppingcart'
          onPress={() => {
            navData.navigation.navigate('CartScreen');
          }}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Orders'
          iconName='menu-fold'
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductsOverview;
