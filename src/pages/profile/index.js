import { Text, Box, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, client } from '../../graphql';

const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1635733754/ck9dkwysgr3inpx6btzn.jpg";

export default function Store(props) {

  const { data } = useQuery(QUERY.GET_USER, {
    fetchPolicy: "cache-first",
    variables: {
      role: "buyer"
    },
    onCompleted: (data) => {
      console.log(data);
    }
  });

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: data ? data.getUser?.image ? data.getUser.image : noImage : noImage }} style={styles.avatar} />
        <View>
          <Text bold fontSize="xl">{data?.getUser?.name}</Text>
          <Text fontSize="lg">{data?.getUser?.phoneNumber}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.title}>Quản lý khuyến mãi</Text>
          <FontAwesome5 name="arrow-right" size={20} color="#A4A4A4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(SCREEN.MENU)}>
          <Text style={styles.title}>Chỉnh sửa menu</Text>
          <FontAwesome5 name="arrow-right" size={20} color="#A4A4A4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.title}>Đánh giá của khách hàng</Text>
          <FontAwesome5 name="arrow-right" size={20} color="#A4A4A4" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardOnline}>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ fontSize: 16, fontFamily: 'SF-UI-Text-Regular' }}>Thêm tài khoản tín dụng</Text>
          <FontAwesome5 name="arrow-right" size={20} color="#A4A4A4" />
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp("100%"),
    backgroundColor: "#fff",
    paddingLeft: wp("5%"),
    paddingBottom: hp("2%"),
    paddingTop: hp("2%"),
    marginBottom: 2,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 6,
    marginRight: 15
  },
  title: {
    fontSize: 16,
    color: "#A4A4A4",
    fontFamily: "SF-UI-Text-Regular",
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 6,
    backgroundColor: 'red',
    width: wp("100%"),
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    marginBottom: 2
  },
  cardOnline: {
    alignItems: 'center',
    backgroundColor: '#fff',
    width: wp("100%"),
    justifyContent: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    width: wp("80%"),
    backgroundColor: '#fff',
    height: hp("10%"),
    borderColor: '#A4A4A4',
    borderWidth: 1,
    borderRadius: 4,
  },

});