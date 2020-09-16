import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <Text style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} x </Text>
        <Text style={styles.title}>{props.title}</Text>
      </Text>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.amount.toFixed(2)} </Text>

        {props.deleteable && (
          <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
            <AntDesign name='delete' size={24} color='red' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
  },
  mainText: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
  },
  title: { fontFamily: 'open-sans-bold', fontSize: 16 },
  deleteButton: {},
  itemData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
