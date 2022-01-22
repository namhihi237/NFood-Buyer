import { Text, Box, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, client } from '../../graphql';
import { display, flexDirection } from "styled-system";
import { storageUtils } from '../../utils';

const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1637807216/user_ilxv1x.png";

export default function Store(props) {

  const { data } = useQuery(QUERY.GET_USER, {
    fetchPolicy: "cache-first",
    variables: {
      role: "buyer"
    },
  });

  const navigation = useNavigation();

  const logOut = async () => {
    await storageUtils.removeItem("token");
    await storageUtils.removeItem("phoneNumber");
    await storageUtils.removeItem("password");
    navigation.navigate(SCREEN.LOGIN, { clear: true });
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="cog" size={hp('2.6%')} color="#fff" style={{ marginRight: 15 }} />
          <FontAwesome5 name="shopping-cart" size={hp('2.6%')} color="#fff" onPress={() => navigation.navigate(SCREEN.CART)} />
        </View>
        <View style={styles.info}>
          <Image source={{ uri: data ? data?.getUser.avatar || noImage : noImage }} style={styles.avatar} />
          <View >
            <Text style={styles.name}>{data?.getUser.name}</Text>
            <Text style={styles.phone}>{data?.getUser.phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View >
        <View style={styles.ordersHeader} >
          <View style={styles.ordersHeaderLeft}>
            <FontAwesome5 name="list-alt" size={hp('2.6%')} color="#3c63b2" style={{ marginRight: 10 }} />
            <Text>Đơn hàng</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS) }}>
            <View style={styles.ordersHeaderLeft}>
              <Text>Tất cả lịch sử mua hàng</Text>
              <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.listOrderContainer}>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 0 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="wallet" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đang chờ</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 1 }) }} >
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="shipping-fast" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đang giao</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 2 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="hand-holding-usd" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đã nhận</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 3 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="window-close" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đã hủy</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.navigate(SCREEN.WALLET)}>
          <View style={styles.ordersHeader} >
            <View style={styles.ordersHeaderLeft}>
              <FontAwesome5 name="wallet" size={hp('2.6%')} color="#3c63b2" style={{ marginRight: 10 }} />
              <Text>Ví của tôi</Text>
            </View>
            <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={logOut}>
          <View style={styles.ordersHeader} >
            <View style={styles.ordersHeaderLeft}>
              <Text bold color="#06b6d4">Đăng xuất tài khoản</Text>
            </View>
            <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
          </View>
        </TouchableWithoutFeedback>

      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  header: {
    height: hp('16%'),
    backgroundColor: '#F24F04'
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('5%'),
  },
  avatar: {
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: hp('4%'),
    marginRight: hp('2%'),
    borderWidth: 1,
    borderColor: '#000'
  },
  name: {
    color: '#fff',
    fontSize: hp('2.6%'),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    color: '#fff',
    fontSize: hp('1.7%')
  },
  headerIcon: {
    width: "100%",
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: 2,
    paddingTop: 20,
    paddingBottom: 20,
  },
  ordersHeaderLeft: {
    flexDirection: 'row',
  },
  orderListIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    paddingHorizontal: 10
  },
  listOrderContainer: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  }

});