import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

const Title = (props) => {
  return (
    <View style={styles.layout}>
      <Text style={styles.title}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    marginTop: 50,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 26,
  },
});

export default Title;
