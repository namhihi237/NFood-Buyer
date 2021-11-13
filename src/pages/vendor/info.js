import { Button, Box, View, Modal } from "native-base";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading, Search, HeaderBack } from '../../components';
import { SCREEN } from "../../constants"
import { GPSUtils } from "../../utils";
import { gps, locationGPS } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY } from "../../graphql";

export default function Info(props) {
  const navigation = useNavigation();
  const { vendor } = props;

  return (
    <View style={styles.contentInfo}>
      <Text style={styles.title} >{vendor?.name}</Text>
      <View style={styles.distanceContainer}>
        <FontAwesome5 name="map-marker-alt" size={15} color="#000" style={{ marginRight: 10 }} />
        <Text style={styles.text} >{parseFloat(vendor?.distance / 1000).toFixed(1)} km</Text>
      </View>
      <View style={styles.distanceContainer}>
        <FontAwesome5 name="star" size={15} color="#ffc107" style={{ marginRight: 10 }} />
        <Text style={styles.text} >{vendor?.rating}</Text>
        <TouchableOpacity>
          <Text style={styles.numberOfReview} >({vendor?.numnerOfReviews || 0} đánh giá)</Text>
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.distanceContainer, justifyContent: 'space-between' }}>
        <Text style={styles.openText} >Chưa mở cửa</Text>
        <TouchableOpacity>
          <Text style={styles.openTime} >Xem giờ mở cửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentInfo: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontFamily: "SF-UI-Display-Semibold",
    fontSize: 20,
    color: "#000",
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#000",
  },
  numberOfReview: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#f24f04",
    marginLeft: 5,
    fontWeight: 'bold',
  },
  openText: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#959BA4",
  },
  openTime: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#36AFDC",
    fontWeight: "bold"
  }

});