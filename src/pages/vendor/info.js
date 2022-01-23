import { View } from "native-base";

import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation } from '@apollo/client';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION } from "../../graphql";
import { Toast } from '../../components';
export default function Info(props) {
  const { vendor } = props;

  const [addFavorite] = useMutation(MUTATION.ADD_FAVORITE, {
    variables: {
      vendorId: vendor?._id,
      isAdd: true
    },
    onCompleted: (data) => {
      Toast('Đã thêm vào danh sách yêu thích');
    },
  })

  return (
    <View style={styles.contentInfo}>
      <Text style={styles.title} >{vendor?.name}</Text>
      <View style={styles.distanceContainer}>
        <FontAwesome5 name="map-marker-alt" size={15} color="#000" style={{ marginRight: 10 }} />
        <Text style={styles.text} >{parseFloat(vendor?.distance / 1000).toFixed(1)} km</Text>
      </View>
      <View style={{ ...styles.distanceContainer, justifyContent: 'space-between' }}>
        <View style={styles.distanceContainer}>
          <FontAwesome5 name="star" size={15} color="#ffc107" style={{ marginRight: 10 }} />
          <Text style={styles.text} >{vendor?.rating}</Text>
          <TouchableOpacity>
            <Text style={styles.numberOfReview} >({vendor?.numberOfReviews || 0} đánh giá)</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addFavorite}>
          <FontAwesome5 name="thumbs-up" size={20} color="#ec4899" style={{ marginBottom: 5, marginRight: 10 }} />
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.distanceContainer, justifyContent: 'space-between' }}>
        <Text style={styles.openText} >Chưa mở cửa</Text>
        <TouchableOpacity>
          <Text style={styles.openTime} >Xem giờ mở cửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentInfo: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontFamily: "SF-UI-Display-Semibold",
    fontSize: 20,
    color: "#000",
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#000",
  },
  numberOfReview: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#f24f04",
    marginLeft: 5,
    fontWeight: 'bold',
  },
  openText: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#959BA4",
  },
  openTime: {
    fontFamily: "SF-UI-Display-Regular",
    fontSize: 15,
    color: "#36AFDC",
    fontWeight: "bold"
  }

});