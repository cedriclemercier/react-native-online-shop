import React from 'react';
import { Platform, View, SafeAreaView, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { useDispatch } from 'react-redux';

import * as authActions from '../store/actions/auth';

import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import ProductsOverview from '../screens/shop/ProductsOverview';
import AuthScreen from '../screens/user/AuthScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import StartupScreen from '../screens/StartupScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import Colors from '../constants/Colors';
import { AntDesign, Entypo } from '@expo/vector-icons';

const defaultNavOptions = {
  defaultNavigationOptions: {
    headerTransparent: true,
    headerTitle: '',
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
      fontFamily: 'open-sans',
    },
  },
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverview,
    ProductDetail: ProductDetailScreen,
    CartScreen: CartScreen,
    OrdersScreen: OrdersScreen,
  },
  defaultNavOptions
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  defaultNavOptions
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  defaultNavOptions
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: {
      screen: ProductsNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig) => <Entypo name='list' color={drawerConfig.tintColor} size={23} />,
      },
    },
    Orders: {
      screen: OrdersNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig) => <AntDesign name='creditcard' color={drawerConfig.tintColor} size={23} />,
      },
    },
    Admin: {
      screen: AdminNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig) => <AntDesign name='dashboard' color={drawerConfig.tintColor} size={23} />,
      },
    },
  },
  {
    contentOptions: {
      activeTintClor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title='logout'
              onPress={() => {
                dispatch(authActions.logout());
                props.navigation.navigate('Auth');
              }}>
              Log Out
            </Button>
          </SafeAreaView>
        </View>
      );
    },
  },
  defaultNavOptions
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  defaultNavOptions
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
