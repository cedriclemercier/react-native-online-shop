import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from '../../components/UI/Card';
import DefaultButton from '../../components/UI/DefaultButton';
import CartItem from './CartItem';

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>{props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <DefaultButton
        mode='contained'
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}>
        {!showDetails ? 'Show Details' : 'Hide Details'}
      </DefaultButton>
      {showDetails && (
        <View style={styles.details}>
          {props.items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: 'white',
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: '#888',
  },
  details: {
    width: '100%',
  },
});
