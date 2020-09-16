import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import Colors from '../../constants/Colors';

const DefaultButton = (props) => {
  return (
    <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
      <Button {...props} icon={props.icon} color={Colors.primary} onPress={props.onPress} mode={props.mode}>
        {props.children}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DefaultButton;
