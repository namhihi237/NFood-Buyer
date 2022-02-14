import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Search = (props) => {

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputText}
        onChangeText={props.onChangeText}
        placeholderTextColor="#979797"
        placeholder={props.placeholder}></TextInput>
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        <FontAwesome5 name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: wp('90%'),
    marginLeft: wp('5%'),
    backgroundColor: '#D7D9DB',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#F24F04',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: {
    height: 40,
    width: '88%',
    fontSize: 18,
    color: '#000',
    paddingLeft: 15,
  }
});