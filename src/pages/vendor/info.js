import { View, Modal, Text, Center, Actionsheet, useDisclose } from "native-base";
import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation, useLazyQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY } from "../../graphql";
import { Toast } from '../../components';
import { timeUtils, vendorUtils } from '../../utils';
import _ from 'lodash';

export default function Info(props) {
  const { vendor } = props;

  const [modalVisible, setModalVisible] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclose();

  const [addFavorite] = useMutation(MUTATION.ADD_FAVORITE, {
    variables: {
      vendorId: vendor?._id,
      isAdd: true
    },

    onCompleted: (data) => {
      Toast('Đã thêm vào danh sách yêu thích');
    },
  })

  const [getReviewsByVendor, { data }] = useLazyQuery(QUERY.GET_REVIEWS_BY_VENDOR, {
    variables: {
      vendorId: vendor?._id
    },
    fetchPolicy: 'network-only',
  });

  const renderRatingToText = (rating) => {
    switch (rating) {
      case 1:
        return "Không hài lòng";
      case 2:
        return "Bình thường";
      case 3:
        return "Hài lòng";
      default:
        return '';
    }
  }

  const renderLike = (item) => {
    const likePercent = parseFloat(item?.rating / item?.numberOfReviews).toFixed(2) * 100;
    if (!likePercent || likePercent.toString() === 'NaN') {
      return 100;
    }
    return likePercent;
  }

  const renderDate = (item) => {
    switch (item.day) {
      case '2':
        return 'Thứ 2';
      case '3':
        return 'Thứ 3';
      case '4':
        return 'Thứ 4';
      case '5':
        return 'Thứ 5';
      case '6':
        return 'Thứ 6';
      case '7':
        return 'Thứ 7';
      case '8':
        return 'Chủ nhật';
    }
  }

  const renderHours = (item) => {
    return `${item.openTime} - ${item.closeTime}`;
  }

  const renderItem = (item, index) => {
    return (
      <View style={styles.itemContainer} key={index}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text bold fontSize="lg">{item.buyer?.name}</Text>
          </View>
          <View style={{ ...styles.ratingText, backgroundColor: item.rating === 3 ? 'red' : item.rating === 2 ? '#166534' : '#7e22ce' }}>
            <Text fontSize="xs" color="#fff" bold>
              {renderRatingToText(item.rating)}
            </Text>
          </View>
        </View>
        <Text italic fontSize="xs" color="#959BA4">{timeUtils.convertFullTime(new Date(item.createdAt - 0))}</Text>

        <Text>{item.comment}</Text>
        <View style={{ height: 1, backgroundColor: '#959BA4' }} mt="2"></View>
      </View>
    )
  }
  return (
    <View style={styles.contentInfo}>
      <Text style={styles.title} >{vendor?.name}</Text>
      {/* <View style={styles.distanceContainer}>
        <FontAwesome5 name="map-marker-alt" size={15} color="#000" style={{ marginRight: 10 }} />
        <Text style={styles.text} >{parseFloat(vendor?.distance / 1000).toFixed(1)} km</Text>
      </View> */}
      <View style={{ ...styles.distanceContainer, justifyContent: 'space-between' }}>
        <View style={styles.distanceContainer}>
          <FontAwesome5 name="thumbs-up" size={15} color="#ffc107" style={{ marginRight: 10 }} />
          <Text style={styles.text} >{renderLike(vendor)}% hài lòng</Text>
          <TouchableOpacity onPress={() => {
            setModalVisible(true);
            getReviewsByVendor();
          }}>
            <Text style={styles.numberOfReview} >({vendor?.numberOfReviews || 0} đánh giá)</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addFavorite}>
          <FontAwesome5 name="heart" size={20} color="#ec4899" style={{ marginBottom: 5, marginRight: 10 }} />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FontAwesome5 name="map-marker-alt" size={15} color="#059669" style={{ marginRight: 10 }} />
        <Text isTruncated={true} style={styles.text} >{vendor?.address}</Text>
      </View>
      <View style={{ ...styles.distanceContainer, justifyContent: 'space-between' }}>
        <Text style={{ ...styles.openText, color: vendorUtils.checkOpen(vendor).isOpen ? '#059669' : '#525252' }} >{vendorUtils.checkOpen(vendor).text}</Text>
        <TouchableOpacity onPress={() => onOpen()}>
          <Text style={styles.openTime} >Xem giờ mở cửa</Text>
        </TouchableOpacity>
      </View>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size="xl">
        <Modal.Content minH="400">
          <Modal.CloseButton />
          <Modal.Header>
            <Center>
              <Text color="#f24f04" isTruncated={true} bold fontSize="md">Đánh giá về hàng</Text>
            </Center>
          </Modal.Header>
          <Modal.Body>
            <SafeAreaView >
              {
                data?.getReviewsByVendor?.reviews?.length > 0
                  ? <FlatList
                    data={data?.getReviewsByVendor?.reviews}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => renderItem(item, index)}
                  /> :
                  <View style={styles.noData}>
                    <Text fontSize="xl">Chưa có đánh giá nào</Text>
                  </View>
              }
            </SafeAreaView>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Actionsheet isOpen={isOpen} onClose={() => {
        onClose();
      }}>
        <Actionsheet.Content>
          {
            vendor?.timeOpen?.map((item, index) => {
              if (item.isOpen) {
                return (
                  <View justifyContent='space-between' flexDirection={'row'} width='100%' pt="2" pb="2" >
                    <Text>{renderDate(item)}: </Text>
                    <Text>{renderHours(item)}</Text>
                  </View>
                )
              }
            })
          }
        </Actionsheet.Content>
      </Actionsheet>
    </View >
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
    marginTop: 8,
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
    fontFamily: "Dongle-Regular",
    fontSize: 15,
    color: "#36AFDC",
    fontWeight: "bold"
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
    marginBottom: 1,
  },
  ratingText: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },
  itemSheet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  }
});