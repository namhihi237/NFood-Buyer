import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'native-base';
import { moneyUtils } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { SCREEN } from "../../constants"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Vendor = (props) => {
  const { item, index } = props.item;
  const navigation = useNavigation();

  const marginLeft = index === 0 ? wp('5%') : 0;
  return (
    <TouchableOpacity style={{ ...styles.container, marginLeft }} onPress={() => navigation.navigate(SCREEN.VENDOR, { vendor: item })}>
      <Image
        source={{ uri: item?.image }}
        style={styles.image} />
      <View style={{ height: 60, }}>
        <Text bold style={styles.name} isTruncated={true} noOfLines={2}>{item?.name}</Text>
      </View>
      <View style={styles.rateContainer}>
        <FontAwesome5 name="map-marker-alt" size={hp('1.9%')} color="#000" />
        <Text style={styles.rate}>{parseFloat(item.distance / 1000).toFixed(1)} km </Text>
      </View>
      <View style={styles.rateContainer}>
        <FontAwesome5 name="star" size={hp('1.9%')} color="#ffc107" />
        <Text style={styles.rate}>{item?.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Vendor;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: wp('33%'),
    height: hp("29%"),
    marginRight: 10,
    borderRadius: 12,

  },
  image: {
    width: wp('33%'),
    height: hp("15%"),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  name: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 10,
    color: "#444251"
  },
  rateContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 5
  },
  rate: {
    fontSize: 14,
    marginLeft: 10,
    color: "#444251"
  }
});