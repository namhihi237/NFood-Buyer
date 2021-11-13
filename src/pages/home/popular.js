import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'native-base';
import { moneyUtils } from '../../utils';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Popular = (props) => {
  const { item, index } = props.item;

  const marginLeft = index === 0 ? wp('5%') : 0;
  return (
    <TouchableOpacity style={{ ...styles.container, marginLeft }} onPress={props.onPress}>
      <Image
        source={{ uri: item?.image }}
        style={styles.image} />
      <Text bold style={styles.name} isTruncated={true} noOfLines={1}>{item?.name}</Text>
      <Text style={styles.price}>$ {moneyUtils.convertVNDToString(item?.price || 0)} vnd</Text>
      <View style={styles.rateContainer}>
        <FontAwesome5 name="star" size={hp('1.9%')} color="#ffc107" />
        <Text style={styles.rate}>{item?.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Popular;

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
  price: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10,
    color: "#444251"
  },
  rateContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
  },
  rate: {
    fontSize: 14,
    marginLeft: 10,
    color: "#444251"
  }
});