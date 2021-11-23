import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import { moneyUtils } from "../../utils";
import { ButtonCustom } from "../../components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Summary = (props) => {
  const { data, subTotal, discount } = props;

  return (
    <View style={styles.checkoutContainer}>
      <View style={styles.totalText}>
        <View style={styles.checkoutText}>
          <Text fontSize="lg">Tổng mặt hàng</Text>
          <Text fontSize="lg">{moneyUtils.convertVNDToString(subTotal)} đ</Text>
        </View>
        <View style={styles.checkoutText}>
          <Text fontSize="lg">Phí giao hàng</Text>
          <Text fontSize="lg">{moneyUtils.convertVNDToString(data?.calculateShipping)} đ</Text>
        </View>
        <View style={styles.checkoutText}>
          <Text fontSize="lg">Giảm giá</Text>
          <Text fontSize="lg">- {moneyUtils.convertVNDToString(discount)} đ</Text>
        </View>
        <Text isTruncated={true}>............................................................................................................</Text>
        <View style={styles.checkoutText}>
          <Text bold fontSize="xl">Tổng cộng</Text>
          <Text bold fontSize="xl">{moneyUtils.convertVNDToString(subTotal + data?.calculateShipping - discount)} đ</Text>
        </View>
      </View>

      <ButtonCustom title="Xác nhận thanh toán" style={{ marginTop: 23 }} width={"90%"} height={"7%"} onPress={props.onPress} />
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  checkoutContainer: {
    backgroundColor: '#fff',
    height: hp('32%'),
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    paddingHorizontal: wp('4%'),
    paddingTop: 25,
    opacity: 1,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },

  },
  checkoutText: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('90%'),
    justifyContent: 'space-between',
    marginTop: 5
  },
});