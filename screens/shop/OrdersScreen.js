import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import * as orderActions from '../../store/actions/orders';

import OrderItem from '../../components/shop/OrderItem';
import Layout from '../../util/Layout';
import Title from '../../components/UI/Title';
import Colors from '../../constants/Colors';

const OrdersScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  // TODO error handling
  useEffect(() => {
    setIsLoading(true);
    dispatch(orderActions.fetchOrders())
      .then(setIsLoading(false))
      .catch((err) => setError(err.message));
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <Title>Your Orders</Title>
        <View style={styles.screen}>
          <Text>No orders found. Time to make your first order! 😊</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <FlatList
        data={orders}
        ListHeaderComponent={<Title>Your Orders</Title>}
        renderItem={(itemData) => (
          <OrderItem
            items={itemData.item.items}
            amount={itemData.item.totalAmount}
            date={itemData.item.readeableDate}
          />
        )}
      />
    </Layout>
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: '',
    headerTransparent: true,
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

export default OrdersScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    margin: 20,
  },
});
