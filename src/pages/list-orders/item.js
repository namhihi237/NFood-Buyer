import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Text, View } from "native-base";
import { moneyUtils, orderUtils } from "../../utils";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Item = (props) => {
  const { order } = props;

  const countNumberOfItems = (orderItems) => {
    let count = 0;
    orderItems.forEach(item => {
      count += item.quantity;
    });
    return count;
  }

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View>
        <View style={{ paddingHorizontal: wp('5%'), backgroundColor: '#fff', paddingVertical: 10 }} flexDirection='row'>
          <Image source={{ uri: order.orderItems[0].image }} style={{ width: wp('23%'), height: wp('23%') }} />
          <View ml='2'>
            <Text mt='2' bold fontSize='md'>#{order.invoiceNumber}</Text>
            <View mt='1' style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('63%') }} >
              <Text>x {countNumberOfItems(order.orderItems)} (món)</Text>
              <Text style={{ color: 'red' }}>{moneyUtils.convertVNDToString(order.total)} đ</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} mt='2'>
              <Text color={orderUtils.orderStatusColor(order.orderStatus)}>
                {orderUtils.orderStatus(order.orderStatus)}
              </Text>
              <Text>{order.deliveredAt}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 1 }}></View>
      </View>
    </TouchableWithoutFeedback>
  )
};

export default Item;
