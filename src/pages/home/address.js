import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from '../constants';
const Address = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.address}>
      <FontAwesome5 name="map-marker-alt" size={wp('4.5%')} color="green" />
      <Text style={styles.addressText} isTruncated={true} bold>{props.address}</Text>
    </TouchableOpacity>
  );
};

export default Address;

const styles = StyleSheet.create({
  address: {
    height: hp('4%'),
    width: wp('90%'),
    backgroundColor: '#A4A4A4',
    marginTop: hp('1%'),
    borderRadius: 12,
    opacity: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    marginLeft: wp('5%'),
  }

});