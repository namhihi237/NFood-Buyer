import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading, Search, HeaderBack } from '../../components';
import { SCREEN } from "../../constants"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY } from "../../graphql";
import Info from "./info";
import Menu from "./menu";

export default function Vendor(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const vendor = route.params.vendor;

  const { data } = useQuery(QUERY.VENDOR, {
    variables: {
      vendorId: vendor._id
    },
    fetchPolicy: 'network-only',
  });

  return (
    <ScrollView style={styles.mainContainer}>
      <Image source={{ uri: data?.vendor?.image }} style={{ height: hp('27%'), width: wp('100%') }} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>
      <Info vendor={data?.vendor} />
      <TouchableOpacity style={styles.group}>
        <FontAwesome5 name="user-plus" size={18} color="#000" />
        <Text style={styles.text}>Đặt hàng theo nhóm</Text>
        <FontAwesome5 name="chevron-right" size={18} color="#000" />
      </TouchableOpacity>
      {data ? <Menu menu={data.vendor?.menu} vendorId={vendor._id} /> : <Loading />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('7%'),
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
  },
  text: {
    fontSize: 16,
    fontFamily: "Avenir Book",
    color: '#000',
  },


});