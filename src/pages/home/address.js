import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Address = (props) => {
  return (
    <TouchableOpacity style={styles.address}>
      <FontAwesome5 name="map-marker-alt" size={wp('4.5%')} color="green" />
      <Text isTruncated={true} ml="2" bold>{props.address?.trim()}</Text>
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
    paddingHorizontal: wp('3%'),
    marginLeft: wp('5%'),
  }

});