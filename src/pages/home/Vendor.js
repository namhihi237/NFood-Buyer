import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'native-base';
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

  const renderLike = (item) => {
    const likePercent = parseFloat(item?.rating / item?.numberOfReviews).toFixed(2) * 100;
    if (!likePercent || likePercent.toString() === 'NaN') {
      return 100;
    }
    return likePercent;
  }

  return (
    <TouchableOpacity style={{ ...styles.container, marginLeft }} onPress={() => navigation.navigate(SCREEN.VENDOR, { vendor: item })}>
      <Image
        source={{ uri: item?.image }}
        style={styles.image} />
      <View style={{ height: 60, }}>
        <Text bold style={styles.name} isTruncated={true} noOfLines={2}>{item?.name}</Text>
      </View>
      <View style={styles.rateContainer}>
        <FontAwesome5 name="map-marker-alt" size={hp('1.9%')} color="#166534" />
        <Text style={styles.rate}>{parseFloat(item.distance / 1000).toFixed(1)} km </Text>
      </View>
      <View style={styles.rateContainer}>
        <FontAwesome5 name="thumbs-up" size={hp('1.9%')} color="#ffc107" />
        <Text style={styles.rate}>{renderLike(item)}% hài lòng</Text>
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