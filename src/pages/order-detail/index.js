import { Text, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
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

  const rendererItems = () => {
    return data?.getOrderByIdBuyer?.orderItems?.map((item, index) => {
      return (
        <View key={index} style={{ paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={styles.text}>{item.name} ({item.quantity.toString().padStart(2, '0')})</Text>
            <Text style={styles.text}>{moneyUtils.convertVNDToString(item.price * item.quantity)} đ</Text>
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
      case 'Delivered':
        status = 'ĐÃ NHẬN HÀNG';
        break;
      case 'Canceled':
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
    if (data?.getOrderByIdBuyer?.orderStatus === 'Pending') {
      // cancelOrder();
    } else if (['Delivered', 'Canceled'].includes(data?.getOrderByIdBuyer?.orderStatus)) {
      navigation.navigate(SCREEN.VENDOR, { vendor: data?.getOrderByIdBuyer?.vendor });
    }
  }

  return (
    <View style={styles.container} >
      <HeaderBack title={`Đơn hàng #${route.params.invoiceNumber}`} />
      <ScrollView>
        <View alignItems="center" justifyContent="center" mt='1' bg="#fff" pt="2" pb="4">
          <FontAwesome5 name={orderUtils.orderStatusIcon(data?.getOrderByIdBuyer?.orderStatus).icon} size={wp('10%')}
            color={orderUtils.orderStatusIcon(data?.getOrderByIdBuyer?.orderStatus).color} />
          <Text style={styles.text} mt="2" bold fontSize="xl">{renderStatus()}</Text>
        </View>
        {
          data?.getOrderByIdBuyer?.shipper ? (<View style={styles.shipperContainer}>
            <View>
              <Text bold fontSize="md">{data?.getOrderByIdBuyer?.shipper?.name}</Text>
              <TouchableOpacity style={styles.reviewerContainer}>
                <Text bold style={styles.text}>Đánh giá người giao hàng</Text>
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
            <Text style={styles.text}>Phí giao hàng</Text>
            <Text style={styles.text}>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.shipping)} đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>Giảm giá</Text>
            <Text style={styles.text}>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.discount)} đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text bold style={styles.text}>Tổng tiền</Text>
            <Text bold style={styles.text}>{moneyUtils.convertVNDToString(data?.getOrderByIdBuyer?.total)} đ</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={onPressButtonClick}>
        <View style={styles.button}>
          <FontAwesome5 name={renderButtonTitle().icon} size={wp('4%')} color="#fff" />
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
  }
});