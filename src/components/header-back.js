import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text, Center } from 'native-base';
import { storageUtils } from '../utils'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from '../constants';
const HeaderBack = (props) => {
  const navigation = useNavigation();
  const onPress = props.onPress ? props.onPress : () => navigation.goBack()
  return (
    <View style={styles.header}>
      <View style={styles.buttonTitle}>
        <TouchableOpacity onPress={onPress} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Center><Text style={styles.text}>{props.title}</Text></Center>
      </View>
      <TouchableWithoutFeedback onPress={() => navigation.navigate(SCREEN.CART)}>
        <FontAwesome5 name="shopping-cart" size={wp('5%')} color="white" style={styles.icon} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default HeaderBack;

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
    marginLeft: 16,
    color: '#fff',
    fontFamily: 'SF-UI-Text-Semibold',
    fontWeight: "bold",
    fontSize: hp('1.8%'),
  },
  backButton: {
    height: hp('4%'),
    width: hp('4%'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B2B6BB'
  },
  right: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: wp('18%'),
  },

});