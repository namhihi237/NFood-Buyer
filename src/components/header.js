import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button, Switch } from "native-base";
// import { Text } from 'native-base';
import { storageUtils } from '../utils'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from '../constants';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
const Header = (props) => {
  const navigation = useNavigation();

  const onPress = props.onPress ? props.onPress : () => navigation.navigate(SCREEN.HOME);

  return (
    <View style={styles.header}>
      <TouchableWithoutFeedback onPress={onPress}>
        <FontAwesome5 name={props.icon || "home"} size={wp('5%')} style={{ color: '#fff' }} />
      </TouchableWithoutFeedback>
      <Text style={styles.text}>{props.title}</Text>

      <TouchableWithoutFeedback onPress={() => navigation.navigate(SCREEN.CART)}>
        <FontAwesome5 name="shopping-cart" size={wp('5%')} color="white" style={styles.icon} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#F24F04',
  },
  buttonTitle: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'SF-UI-Text-Semibold',
    fontWeight: "bold",
    fontSize: hp('2%'),
  },

  right: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: wp('18%'),
  },

});