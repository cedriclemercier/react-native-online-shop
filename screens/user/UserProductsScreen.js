import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import DefaultButton from '../../components/UI/DefaultButton';

import Layout from '../../util/Layout';
import Title from '../../components/UI/Title';

// Actions
import * as productActions from '../../store/actions/product';

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => dispatch(productActions.removeItem(id)) },
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <Layout>
        <Title>Your Products</Title>
        <View style={styles.screen}>
          <Text>No products found. Maybe start adding some! 😊</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <FlatList
        ListHeaderComponent={<Title>Your Products</Title>}
        data={userProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            onSelect={() => {}}
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}>
            <DefaultButton icon='menu' onPress={() => editProductHandler(itemData.item.id)} mode='contained'>
              Edit
            </DefaultButton>
            <DefaultButton
              icon='cart'
              onPress={() => {
                deleteHandler(itemData.item.id);
              }}
              mode='contained'>
              Delete
            </DefaultButton>
          </ProductItem>
        )}
      />
    </Layout>
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Edit'
          iconName='addfile'
          onPress={() => {
            navData.navigation.navigate('EditProduct');
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

export default UserProductsScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
});
