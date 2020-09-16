import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import Layout from '../util/Layout';
import Title from '../components/UI/Title';
import Colors from '../constants/Colors';

const StartupScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        props.navigation.navigate('Auth');
        return;
      }

      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;

      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate('Auth');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      props.navigation.navigate('Shop');
      dispatch(authActions.authenticate(token, userId, expirationTime));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <Layout>
      <ActivityIndicator size='large' color={Colors.primary} />
    </Layout>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({});
