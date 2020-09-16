import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Layout = (props) => {
  if (props.linearGradient) {
    return (
      <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.gradient}>
        <View
          style={
            ({
              backgroundColor: !props.linearGradient && 'white',
            },
            styles.layout)
          }>
          {props.children}
        </View>
      </LinearGradient>
    );
  }

  return <View style={styles.layout}>{props.children}</View>;
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingTop: 100,
  },
  gradient: { flex: 1 },
});

export default Layout;
