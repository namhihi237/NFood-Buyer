import { Heading, SectionList, View, Modal, Center } from "native-base";

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


export default function Cart(props) {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View>
      <HeaderBack title="Giỏ hàng của bạn" />
      <ScrollView style={styles.mainContainer}>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({



});