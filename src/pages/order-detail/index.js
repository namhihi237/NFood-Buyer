import { Text, View } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { moneyUtils, orderUtils } from "../../utils";
export default function OrderDetail(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const { data } = useQuery(QUERY.GET_ORDER_BY_ID, {
    variables: {
      id: route.params.orderId
    },
    fetchPolicy: 'network-only',
  });

  const [cancelOrderPending] = useMutation(MUTATION.CANCEL_ORDER, {
    onCompleted: () => {
      navigation.goBack();
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const rendererItems = () => {
    return data?.getOrderByIdBuyer?.orderItems?.map((item, index) => {
      return (
        <View key={index} style={{ paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text>{item.name} ({item.quantity.toString().padStart(2, '0')})</Text>
            <Text>{moneyUtils.convertVNDToString(item.price * item.quantity)} đ</Text>
          </View>
        </View>
      )
    });
  }

  const renderNumberOfItems = () => {
    let numberOfItems = 0;
    data?.getOrderByIdBuyer?.orderItems?.map((item) => {
      numberOfItems += item.quantity;
    });
    return numberOfItems;
  }

  const renderStatus = () => {
    let status = '';
    switch (data?.getOrderByIdBuyer?.orderStatus) {
      case 'Pending':
        status = 'CHỜ XÁC NHẬN';
        break;
      case 'Processing':
        status = 'ĐANG LẤY HÀNG';
        break;
      case 'Shipping':
        status = 'ĐANG GIAO HÀNG';
        break;
      case 'Delivered':
        status = 'ĐÃ NHẬN HÀNG';
        break;
      case 'Cancelled':
        status = 'ĐÃ HỦY';
        break;
      default:
        break;
    }
    return status;
  }

  const renderButtonTitle = () => {
    let title = '';
    let icon = '';
    switch (data?.getOrderByIdBuyer?.orderStatus) {
      case 'Pending':
        title = 'HỦY ĐƠN';
        icon = 'window-close';
        break;
      case 'Processing':
        title = 'HỦY ĐƠN';
        icon = 'window-close';
      case 'Delivered':
        title = 'ĐẶT LẠI';
        icon = 'undo-alt';
        break;
      case 'Canceled':
        title = 'ĐẶT LẠI';
        icon = 'undo-alt';
        break;
      default:
        break;
    }
    return { title, icon };
  }

  const onPressButtonClick = () => {
    if (data?.getOrderByIdBuyer?.orderStatus === 'Pending' || data?.getOrderByIdBuyer?.orderStatus === 'Processing') {
      cancelOrderPending({
        variables: {
          id: route.params.orderId
        }
      });
    } else if (['Delivered', 'Canceled'].includes(data?.getOrderByIdBuyer?.orderStatus)) {
      navigation.navigate(SCREEN.VENDOR, { vendor: data?.getOrderByIdBuyer?.vendor });
    }
  }

  const renderShipper = () => {
    if (data?.getOrderByIdBuyer?.orderStatus === 'Shipping' || data?.getOrderByIdBuyer?.orderStatus === 'Processing') {
      return `Xem trên bản đồ`;
    } else if (data?.getOrderByIdBuyer?.orderStatus === 'Delivered') {
      if (data?.getOrderByIdBuyer?.isReviewedShipper) {
        return `Đã đánh giá`;
      }
      return `Đánh giá người giao hàng`;
    }
  }

  const renderTitleVendor = () => {
    if (data?.getOrderByIdBuyer?.isReviewedVendor) {
      return `Đã đánh giá`;
    }
    return `Đánh giá nhà của hàng`;
  }

  const actionShipper = () => {
    if (data?.getOrderByIdBuyer?.orderStatus === 'Shipping' || data?.getOrderByIdBuyer?.orderStatus === 'Processing') {
      navigation.navigate(SCREEN.TRACK_ORDER, {
        orderId: route.params.orderId,
      });
    } else if (data?.getOrderByIdBuyer?.orderStatus === 'Delivered') {
      navigation.navigate(SCREEN.REVIEW_SHIPPER, {
        shipper: data?.getOrderByIdBuyer?.shipper,
        orderId: route.params.orderId,
      });
    }
  }

  return (
    <View style={styles.container} >
      <HeaderBack title={`Đơn hàng #${route.params.invoiceNumber || data?.getOrderByIdBuyer?.invoiceNumber}`} />
      <ScrollView>
        <View alignItems="center" justifyContent="center" mt='1' bg="#fff" pt="2" pb="4">
          <FontAwesome5 name={orderUtils.orderStatusIcon(data?.getOrderByIdBuyer?.orderStatus).icon} size={wp('10%')}
            color={orderUtils.orderStatusIcon(data?.getOrderByIdBuyer?.orderStatus).color} />
          <Text mt="2" bold fontSize="xl">{renderStatus()}</Text>
        </View>
        {
          data?.getOrderByIdBuyer?.shipper ? (<View style={styles.shipperContainer}>
            <View>
              <Text bold fontSize="md">{data?.getOrderByIdBuyer?.shipper?.name}</Text>
              <TouchableOpacity style={styles.reviewerContainer} onPress={actionShipper}>
                <Text bold color={data?.getOrderByIdBuyer?.isReviewedShipper ? "#16a34a" : '#F24F04'}>{renderShipper()}</Text>
              </TouchableOpacity>
            </View>
            <Image style={styles.image} source={{ uri: data?.getOrderByIdBuyer?.shipper?.image }} />
          </View>) : null
        }
        <View style={styles.orderContainer}>
          <Text fontSize="md" color="#959BA4">#{data?.getOrderByIdBuyer?.invoiceNumber}</Text>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}
            onPress={() => navigation.navigate(SCREEN.VENDOR, { vendor: data?.getOrderByIdBuyer?.vendor })}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesome5 name="utensils" size={wp('3.2%')} color="#F24F04" style={{ marginTop: 3 }} />
              <View style={{ marginLeft: 10 }}>
                <Text >Nơi mua hàng</Text>
                <Text bold>{data?.getOrderByIdBuyer?.vendor?.name}</Text>
              </View>
            </View>
            {
              data?.getOrderByIdBuyer?.orderStatus === 'Delivered' ? (<TouchableOpacity onPress={() => navigation.navigate(SCREEN.REVIEW_VENDOR, {
                vendor: data?.getOrderByIdBuyer?.vendor,
                invoiceNumber: data?.getOrderByIdBuyer?.invoiceNumber,
                orderId: route.params.orderId,
              })}>
                <Text bold color={data?.getOrderByIdBuyer?.isReviewedVendor ? "#16a34a" : '#F24F04'}>{renderTitleVendor()}</Text>
              </TouchableOpacity>) : null
            }
            <FontAwesome5 name="chevron-right" size={wp('4.5%')} color="#444251" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <FontAwesome5 name="map-marker-alt" size={wp('4%')} color="#F24F04" />
            <View style={{ marginLeft: 10 }}>
              <Text >Nơi giao hàng</Text>
              <Text bold isTruncated>{data?.getOrderByIdBuyer?.address} </Text>
            </View>
          </View>
        </View>
        <View style={styles.detailItems}>
          <Text bold fontSize="md">Danh sách món ăn ({renderNumberOfItems()}) </Text>
          {rendererItems()}
          <Text isTruncated>................................................................................................................</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Phí giao hàng</Text>
            <Text>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.shipping)} đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Giảm giá</Text>
            <Text>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.discount)} đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text bold>Tổng tiền</Text>
            <Text bold>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.total)} đ</Text>
          </View>
        </View>
        <View style={styles.paymentContainer}>
          <Text bold fontSize="md">PHƯƠNG THỨC THANH TOÁN</Text>
          <View style={styles.payment}>
            {
              data?.getOrderByIdBuyer?.paymentMethod === 'CRE' ? (<FontAwesome5 name="credit-card" size={wp('4%')} color="#F24F04" />) : (
                <FontAwesome5 name="money-bill-wave" size={wp('4%')} color="#16a34a" />)
            }
            <Text style={{ marginLeft: 10 }}>{orderUtils.paymentMethod(data?.getOrderByIdBuyer?.paymentMethod)}</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={onPressButtonClick}>
        <View style={styles.button}>
          <FontAwesome5 name={renderButtonTitle().icon} size={wp('3.9%')} color="#fff" />
          <Text fontSize="md" ml="2" color="#fff">{renderButtonTitle().title}</Text>
        </View>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  shipperContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: hp('2%'),
  },
  image: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('10%'),
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  detailItems: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    marginTop: 10,
    paddingBottom: hp('2%'),
  },
  button: {
    backgroundColor: '#1a91ff',
    paddingVertical: hp('1.6%'),
    marginHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  reviewerContainer: {
    backgroundColor: '#D7D9DB',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 7,
  },
  paymentContainer: {
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 10,
  },
  payment: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 5,
  }
});