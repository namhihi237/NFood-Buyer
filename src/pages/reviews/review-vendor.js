import { Text, View, Box, TextArea } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { QUERY, MUTATION, SUBSCRIPTION, client } from "../../graphql";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function ReviewVendor(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const [rating, setRating] = React.useState(3);
  const [comment, setComment] = React.useState('');

  const onChangeComment = (comment) => setComment(comment);

  const [addReview] = useMutation(MUTATION.ADD_REVIEW, {
    variables: {
      rating: rating,
      comment: comment,
      reviewedId: route.params?.vendor?._id,
      type: 'vendor',
      orderId: route.params?.orderId
    },
    onCompleted: (data) => {
      Toast('Đánh giá thành công', 'success', 'top-right');
      navigation.goBack();
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  return (
    <View style={styles.container} >
      <HeaderBack title="Cảm nhận về cửa hàng" />
      <View style={styles.vendorHeader}>
        <Text fontSize="md" color="#959BA4" bold>Nơi mua hàng</Text>
        <Text fontSize="md" color="#959BA4">Đơn hàng: #{route.params?.invoiceNumber}</Text>
      </View>
      <View style={styles.vendor}>
        <Image source={{ uri: route.params?.vendor?.image }} style={{ height: 60, width: 60, marginRight: 15 }} />
        <View>
          <Text bold fontSize="md" isTruncated={true}>{route.params?.vendor?.name}</Text>
          <Text fontSize="md" italic isTruncated={true}> {route.params?.vendor?.address}</Text>
        </View>

      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setRating(1)}>
          <Image source={require('../../../assets/images/bad.png')} style={styles.icon} />
          <Text bold style={{ color: rating === 1 ? '#7e22ce' : '#959BA4' }}>Chưa hài lòng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => setRating(2)}>
          <Image source={require('../../../assets/images/nomarl.png')} style={styles.icon} />
          <Text bold style={{ color: rating === 2 ? '#166534' : '#959BA4' }}>Bình thường</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => setRating(3)}>
          <Image source={require('../../../assets/images/good.png')} style={styles.icon} />
          <Text bold style={{ color: rating === 3 ? 'red' : '#959BA4' }}>Hài lòng</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentContainer}>
        <View>
          <View style={styles.commentHeader}>
            <FontAwesome5 name="comment-alt" size={20} color="#7e22ce" />
            <Text style={{ marginLeft: 10 }}>Nhận xét của bạn</Text>
          </View>
          <TextArea
            totalLines={5}
            h={20}
            onChangeText={onChangeComment}
            bordered
            placeholder="Nhập nhận xét của bạn"
            style={{ marginBottom: 100 }} />
        </View>

        <ButtonCustom title={"Gửi đánh giá"} height="6%" width="90" onPress={addReview} />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  vendorHeader: {
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vendor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: wp('5%'),
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('5%'),
    backgroundColor: '#D7D9DB',
    marginTop: 20,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: 15,
  },
  icon: {
    height: 70,
    width: 70,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentContainer: {
    marginHorizontal: wp('5%'),
    marginTop: 40,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: hp('2%'),
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  }
});