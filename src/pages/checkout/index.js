import { Text, Input, View, Checkbox, Button, Modal } from "native-base";
import React from "react";
import { StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import { SCREEN } from "../../constants";
import { HeaderBack, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { myAddress, listCarts, numberOfCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import Summary from "./summary";
import axios from "axios";
import { storageUtils } from '../../utils';
const url = 'https://nfood-api.southeastasia.cloudapp.azure.com/api/v1/payment/charge-order';
const baseUrl = 'https://nfood-api.southeastasia.cloudapp.azure.com/api/v1';

export default function Checkout(props) {

  const navigation = useNavigation();
  const route = useRoute();
  const [discount, setDiscount] = React.useState(0);
  const [promoCode, setPromoCode] = React.useState('');
  const [address, setAddress] = useRecoilState(myAddress);
  const [method, setMethod] = React.useState("");
  const [isCOD, setIsCOD] = React.useState(false);
  const [isCredit, setIsCredit] = React.useState(false);
  const [isWallet, setIsWallet] = React.useState(false);
  const [carts, setCarts] = useRecoilState(listCarts);
  const [number, setNumber] = useRecoilState(numberOfCarts);

  const [showModal, setShowModal] = React.useState(false);
  const [urlPayment, setUrlPayment] = React.useState('');

  const onChangePromoCode = (value) => setPromoCode(value);

  const { data } = useQuery(QUERY.CALCULATE_SHIPPING, {
    fetchPolicy: 'network-only',
    variables: {
      vendorId: route.params.vendorId
    },
  });

  const { data: profile } = useQuery(QUERY.GET_USER, {
    fetchPolicy: "cache-first",
    variables: {
      role: "buyer"
    }
  });

  const chargeOrder = async () => {
    try {
      const token = await storageUtils.getString('token');
      const { data: result } = await axios.get(`${baseUrl}/vendor/${route.params.vendorId}/check-open`);
      if (result.status === false) {
        Toast('Cửa hàng này hiện tại không mở cửa', 'danger', 'top-right');
        return;
      }

      const { data } = await axios.post(`${url}`, {
        promoCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUrlPayment(data.url);
      setShowModal(true);
      return
    } catch (error) {
      Toast('Có lỗi xảy ra, vui lòng thử lại sau', 'danger', 'top-right');

    }
  }

  const [order] = useMutation(MUTATION.CHECKOUT, {
    onCompleted: (data) => {
      Toast("Đặt hàng thành công", "success", "top-right");
      setNumber(0);
      setCarts([]);
      navigation.navigate(SCREEN.LIST_ORDERS, {
        clear: true,
      });
    },
    onError: (error) => {
      Toast(error.message, "danger", "top-right");
    }
  });

  const onchangeCheckBox = (isSelected, cod, wallet) => {
    if (isSelected) {
      if (cod) {
        setIsCOD(true);
        setIsCredit(false);
        setIsWallet(false);
        setMethod("COD");
      }
      else if (wallet) {
        setIsCOD(false);
        setIsCredit(false);
        setIsWallet(true);
        setMethod("WALLET");
      } else {
        setIsCOD(false);
        setIsCredit(true);
        setIsWallet(false);
        setMethod("CRE");
      }
    } else {
      setIsCOD(false);
      setIsCredit(false);
      setIsWallet(false);
      setMethod("");
    }
  }

  const calculateDiscount = (discount, discountType) => {
    const subTotal = route.params.subTotal;
    if (discountType === 'PERCENT') {
      return subTotal * (discount / 100);
    } else {
      return discount;
    }
  }

  const [checkVoucher] = useLazyQuery(QUERY.CHECK_PROMO_CODE, {
    variables: {
      promoCode: promoCode.toLocaleUpperCase(),
      subTotal: route.params.subTotal,
      vendorId: route.params.vendorId
    },
    onCompleted: (data) => {
      setDiscount(calculateDiscount(data.checkPromoCode.discount, data.checkPromoCode.discountType));

    },
    onError: (error) => {
      Toast(error.message, "danger", "top-right");
      setDiscount(0);
    }
  })

  const checkOut = async () => {
    if (method === "") {
      Toast("Bạn chưa chọn phương thức thanh toán", "warning", "top-right");
      return;
    } else if (method === 'CRE') {
      await chargeOrder();
      return;
    }
    order({ variables: { method, promoCode: promoCode.toLocaleUpperCase() } });
  }

  const checkPromoCode = () => {
    // check required promoCode
    if (promoCode === '') {
      Toast('Bạn chưa nhập mã khuyến mãi', 'warning', 'top-right');
      return;
    }

    checkVoucher();
  }

  const handleResponse = data => {
    if (data.title === "success") {
      setShowModal(false);
      Toast("Thanh toán thành công", "success", "top-right");
      setNumber(0);
      setCarts([]);
      navigation.navigate(SCREEN.LIST_ORDERS);
    } else if (data.title === "cancel") {
      Toast("Thanh toán thất bại, thử lại", "danger", "top-right");
      setShowModal(false);
    } else if (data.title === "not-open") {
      Toast("Cửa hàng hiện tại chưa mở cửa", "danger", "top-right");
      setShowModal(false);
    } else {
      return;
    }
  };

  return (
    <View style={styles.container} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <View>
        <HeaderBack title={"Đặt hàng & thanh toán"} />
        <Text fontSize="xl" bold style={{ ...styles.textTitle, marginTop: 10, marginBottom: 10 }}>Đơn Hàng Sẽ được giao đến</Text>
        <View style={styles.infoContainer}>
          <Text fontSize="md">{profile?.getUser.name}</Text>
          <Text fontSize="md">{address}</Text>
        </View>
        <View style={styles.paymentContainer}>
          <Text fontSize="xl" bold>Phương thức thanh toán</Text>
          <View style={styles.leftContainer}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/images/paypal-icon.png")} style={styles.iconPayment} />
              </View>
              <Text fontSize="lg">Thanh toán qua paypal</Text>
            </View>
            <Checkbox colorScheme="orange" style={{ marginTop: 12 }}
              onChange={(isSelected) => onchangeCheckBox(isSelected)}
              accessibilityLabel="This is visa card method checkbox" isChecked={isCredit} />
          </View>
          <View style={styles.leftContainer}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/images/cod.png")} style={{ width: 30, height: 30 }} />
              </View>
              <Text fontSize="lg">Thanh toán khi nhận hàng</Text>
            </View>
            <Checkbox colorScheme="orange" style={{ marginTop: 12 }}
              accessibilityLabel="This is cod method checkbox"
              onChange={(isSelected) => onchangeCheckBox(isSelected, true)}
              isChecked={isCOD} />
          </View>
          <View style={styles.leftContainer}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/images/wallet.png")} style={{ width: 30, height: 30 }} />
              </View>
              <Text fontSize="lg">Thanh toán bằng tài khoản trong ví</Text>
            </View>
            <Checkbox colorScheme="orange" style={{ marginTop: 12 }}
              accessibilityLabel="This is wallet method checkbox"
              onChange={(isSelected) => onchangeCheckBox(isSelected, false, true)}
              isChecked={isWallet} />
          </View>
        </View>

        <View style={styles.promoCodeContainer}>
          <Text fontSize="lg" style={{ marginBottom: 5 }}>Mã giảm giá</Text>
          <Input
            type={"text"}
            borderColor="#B2B6BB"
            w={{
              base: "100%",
              md: "25%",
            }}
            onChangeText={onChangePromoCode}
            InputRightElement={
              <Button size="xs" rounded="none" w="1/6" h="full" onPress={checkPromoCode}>
                {"Áp dụng"}
              </Button>
            }
          />
        </View>
      </View>
      <Summary data={data} discount={discount} subTotal={route.params.subTotal} onPress={checkOut} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body minHeight="600px">
            <WebView
              source={{ uri: urlPayment }}
              style={{ marginTop: 20 }}
              onNavigationStateChange={(event) => handleResponse(event)}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeee',
    justifyContent: 'space-between'
  },
  textTitle: {
    color: '#444251',
    marginLeft: wp('5%')
  },
  paymentContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: 25,
    marginBottom: 25,
  },
  iconContainer: {
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: '#D7D9DB',
    marginRight: 15
  },
  iconPayment: {
    height: 20,
    width: 18.6,
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('90%'),
    justifyContent: "space-between",
    marginTop: 10
  },

  promoCodeContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: 15
  },
  infoContainer: {
    paddingHorizontal: wp('5%'),
  }

});