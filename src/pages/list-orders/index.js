import { Text, Input, View, Checkbox, Button } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { myAddress, listCarts, numberOfCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";

export default function ListOrders(props) {

  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <HeaderBack title="Đơn hàng của bạn" />
    </View >
  );
}

const styles = StyleSheet.create({


});