import { Heading, SectionList, View, Modal, Center } from "native-base";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { InputField, ButtonCustom, Toast, Loading, Search, HeaderBack } from '../../components';
import { SCREEN } from "../../constants"
import { moneyUtils } from "../../utils";
import { gps, locationGPS, listCarts, numberOfCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY, client } from "../../graphql";
import _ from 'lodash';
export default function Cart(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const [carts, setCart] = useRecoilState(listCarts);
  const [number, setNumber] = useRecoilState(numberOfCarts);

  const { data } = useQuery(QUERY.GET_CARTS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setCart(data.carts.carts);
    },
  });

  const reduceQuantity = (cartId) => {
    const newCartsUpdate = carts.map(cart => {
      if (cart._id === cartId) {
        if (cart.quantity > 1) {
          cart = JSON.parse(JSON.stringify(cart));
          cart.quantity = cart.quantity - 1;
          // update db
          updateCartItem({ variables: { id: cart._id, quantity: cart.quantity } });
        } else if (cart.quantity === 1) {
          cart = JSON.parse(JSON.stringify(cart));
          // delete cart
          cart.quantity = 0;
          deleteCartItem({ variables: { id: cartId } });
        }
      }
      return cart;
    }).filter(cart => cart.quantity > 0);
    setCart(newCartsUpdate);
    setNumber(number - 1);
  }

  const increaseQuantity = (cartId) => {
    const newCartsUpdate = carts.map((cart) => {
      if (cart._id === cartId) {
        cart = JSON.parse(JSON.stringify(cart));
        cart.quantity = cart.quantity + 1;
        // update db
        updateCartItem({ variables: { id: cart._id, quantity: cart.quantity } });
      }
      return cart;
    });
    setCart(newCartsUpdate);
    setNumber(number + 1);
  }

  const [updateCartItem] = useMutation(MUTATION.UPDATE_CART_ITEM);
  const [deleteCartItem] = useMutation(MUTATION.DELETE_CART);

  const rendererItems = () => {
    return carts?.map((cart, index) => {
      return (
        <View key={index} style={{ paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={styles.text}>{cart.item.name}</Text>
            <Text style={styles.text}>{moneyUtils.convertVNDToString(cart.item.price * cart.quantity)} đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.quantity}>
              <TouchableOpacity style={styles.buttonContainer} onPress={() => reduceQuantity(cart._id)}>
                <FontAwesome5 name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{cart.quantity.toString().padStart(2, '0')}</Text>
              <TouchableOpacity style={styles.buttonContainer} onPress={() => increaseQuantity(cart._id)}>
                <FontAwesome5 name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    });
  }

  const renderTotal = () => {
    return carts?.reduce((total, cart) => {
      return total + (cart.item.price * cart.quantity);
    }, 0);
  }

  const checkout = () => {
    navigation.navigate(SCREEN.CHECKOUT, { subtotal: renderTotal(), vendorId: data?.carts?.vendor._id });
  }

  return (
    <View style={{ height: '100%' }}>
      <HeaderBack title="Giỏ hàng của tôi" />
      <ScrollView style={{ marginTop: 10, marginBottom: hp('15%') }}>
        {data?.carts?.vendor ? (<TouchableOpacity style={styles.vendorContainer}>
          <View>
            <Text style={styles.vendorName}>{data?.carts?.vendor?.name}</Text>
            <Text style={styles.address}>{data?.carts?.vendor?.address}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={20} color="#000" />
        </TouchableOpacity>) : (<View style={{ justifyContent: 'center', alignItems: 'center', height: 100 }}>
          <Text style={styles.noCart}>Bạn chưa chọn món ăn nào</Text>
        </View>)}
        <View style={{ paddingHorizontal: wp("4%"), backgroundColor: '#fff' }}>
          {data ? rendererItems() : null}
        </View>
      </ScrollView>
      <View style={styles.orderContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={styles.text}>Tổng đơn (tạm tính)</Text>
          <Text style={styles.text}>{moneyUtils.convertVNDToString(renderTotal())} đ</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={checkout}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Đặt món</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vendorContainer: {
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
    marginBottom: hp('1%'),
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp('1%'),
  },
  address: {
    fontSize: 16,
    color: '#959ba4',
    fontFamily: 'HelveticaNeue'
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'HelveticaNeue'
  },
  quantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: wp('22%'),
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#b2b6bb',
  },
  orderContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
    marginTop: 2,
    position: 'absolute',
    bottom: 0,
  },
  orderButton: {
    width: wp('92%'),
    height: hp('6%'),
    backgroundColor: '#f24f04',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCart: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: '#000'
  }

});