import { View } from "native-base";
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moneyUtils } from "../../utils";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default function Order(props) {

  const { quantity, price } = props;

  return (
    <View style={styles.orderContainer}>
      <View style={styles.quantity}>
        <TouchableOpacity style={styles.buttonContainer} onPress={props.reduce}>
          <FontAwesome5 name="minus" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={props.increase}>
          <FontAwesome5 name="plus" size={18} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.buttonOrder} onPress={props.addToCart}>
        <Text style={styles.buttonOrderText}>+ {moneyUtils.convertVNDToString(quantity * price)} đ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('92%'),
    alignItems: 'center',
  },
  quantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: wp('25%'),
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#b2b6bb',
  },
  buttonOrder: {
    backgroundColor: '#f24f04',
    height: hp('6%'),
    width: wp('50%'),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOrderText: {
    fontSize: 19,
  }

});