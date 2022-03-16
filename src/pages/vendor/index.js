import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { Modal, Text, View } from 'native-base';
import { Loading } from '../../components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { QUERY } from "../../graphql";
import Info from "./info";
import Menu from "./menu";
import { moneyUtils } from '../../utils';

export default function Vendor(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const vendor = route.params.vendor;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [voucher, setVoucher] = React.useState(null);

  const { data } = useQuery(QUERY.VENDOR, {
    variables: {
      vendorId: vendor._id
    },
    fetchPolicy: 'network-only',
  });

  const returnContentVoucher = (voucher) => {
    let content = '';
    if (voucher?.discountType === 'FIXED') {
      content = `Giảm ${moneyUtils.convertVNDToString(voucher?.discount)}đ cho tổng hóa đơn.`;
    } else if (voucher?.discountType === 'PERCENT') {
      content = `Giảm ${voucher?.discount}% cho tổng đơn hàng.`;
    }
    return content;
  }

  const renderTimeApply = (voucher) => {
    if (voucher?.startDate && voucher?.endDate) {
      return `${voucher?.startDate} - ${voucher?.endDate}`;
    }
    return 'Không giới hạn';
  }

  const renderConditionsMinTotal = (voucher) => {
    if (voucher?.discountType === 'PERCENT' && voucher?.minTotal) {
      return `* Đơn hàng từ ${moneyUtils.convertVNDToString(voucher?.minTotal)}đ`;
    }
  }

  const renderConditionsMaxDiscount = (voucher) => {
    if (voucher?.discountType === 'PERCENT' && voucher?.maxDiscount) {
      return `* Giảm tối đa ${moneyUtils.convertVNDToString(voucher?.maxDiscount)}đ`;
    }
  }

  const showVoucher = (voucher) => {
    setVoucher(voucher);
    setModalVisible(true);
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <Image source={{ uri: data?.vendor?.image }} style={{ height: hp('27%'), width: wp('100%') }} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>
      <Info vendor={data?.vendor} />
      <View style={styles.kmContainer}>
        <Text style={styles.textTitle}>KHUYẾN MÃI</Text>
      </View>

      {
        data?.vendor?.vouchers.length > 0 ? (
          data?.vendor?.vouchers.map((voucher, index) => {
            return (
              <TouchableOpacity key={index} style={styles.voucherContainer} onPress={() => showVoucher(voucher)}>
                <Text>{returnContentVoucher(voucher)}</Text>
                <FontAwesome5 name="chevron-right" size={18} color="#000" />
              </TouchableOpacity>
            )
          })
        ) : null
      }

      <TouchableOpacity style={styles.group}>
        <FontAwesome5 name="user-plus" size={18} color="#000" />
        <Text style={styles.text}>Đặt hàng theo nhóm</Text>
        <FontAwesome5 name="chevron-right" size={18} color="#000" />
      </TouchableOpacity>
      {data ? <Menu menu={data.vendor?.menu} vendorId={vendor._id} /> : <Loading />}
      <View>
        <Modal isOpen={modalVisible} onClose={setModalVisible}>
          <Modal.Content maxH="212" minH="200">
            <Modal.CloseButton />
            <Modal.Body>
              <View style={styles.promoCodeContainer}>
                <Text bold fontSize="md" color={"#dc2626"}>{voucher?.promoCode}</Text>
                <Text bold>{returnContentVoucher(voucher)}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text bold>Thời gian áp dụng</Text>
                <Text italic fontSize="sm">{renderTimeApply(voucher)}</Text>
              </View>

              <View>
                <Text bold>Điều kiện sửa dụng</Text>
                <Text fontSize="sm" italic>* Một khách hàng chỉ được sử dụng 1 lần.</Text>
                <Text fontSize="sm" italic>{renderConditionsMinTotal(voucher)}</Text>
                <Text fontSize="sm" italic>{renderConditionsMaxDiscount(voucher)}</Text>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('7%'),
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
  },
  text: {
    fontSize: 14,
    fontFamily: "Avenir Book",
    color: '#000',
  },
  textTitle: {
    color: '#000',
    fontSize: 16,
    fontFamily: "Avenir Book",
    fontWeight: 'bold',
  },
  kmContainer: {
    backgroundColor: '#fff',
    marginBottom: 5,
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('3%'),
  },
  voucherContainer: {
    backgroundColor: '#fff',
    marginTop: 1,
    marginBottom: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  promoCodeContainer: {

  },
  timeContainer: {
    backgroundColor: '#fff',
    marginTop: 5,
  }
});