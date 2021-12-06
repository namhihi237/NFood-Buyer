import { Text, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { TabView, SceneMap } from 'react-native-tab-view';

export default function TrackingOrder(props) {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container} >
      <HeaderBack title="Theo giõi đơn hàng" />

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});