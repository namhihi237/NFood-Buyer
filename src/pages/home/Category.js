import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Category = (props) => {
  const { item } = props.item;

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text fontSize="md" bold>{item?.name}</Text>
    </TouchableOpacity>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: wp('31%'),
    height: 45,
    marginRight: 6,
    borderRadius: 26,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: wp('5%'),
  },
  image: {
    width: 30,
    height: 30,
  }
});