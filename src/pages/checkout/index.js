import { Text, Input, View, Checkbox, Button } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { myAddress, listCarts, numberOfCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import Summary from "./summary";

export default function Checkout(props) {

  const navigation = useNavigation();
  const route = useRoute();
  const [discount, setDiscount] = React.useState(0);
  const [promoCode, setPromoCode] = React.useState('');
  const [address, setAddress] = useRecoilState(myAddress);
  const [method, setMethod] = React.useState("");
  const [isCOD, setIsCOD] = React.useState(false);
  const [isCredit, setIsCredit] = React.useState(false);
  const [carts, setCarts] = useRecoilState(listCarts);
  const [number, setNumber] = useRecoilState(numberOfCarts);

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

  const [order, { loading }] = useMutation(MUTATION.CHECKOUT, {
    onCompleted: (data) => {
      Toast("Đặt hàng thành công", "success", "top-right");
      setNumber(0);
      setCarts([]);
      navigation.navigate(SCREEN.LIST_ORDERS);
      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN.HOME }],
      });
    }
  });

  const onchangeCheckBox = (isSelected, cod) => {
    if (isSelected) {
      if (cod) {
        setIsCOD(true);
        setIsCredit(false);
        setMethod("COD");
      } else {
        setIsCOD(false);
        setIsCredit(true);
        setMethod("ONLINE");
      }
    } else {
      if (cod) {
        setIsCOD(false);
        setIsCredit(false);
        setMethod("");
      } else {
        setIsCOD(false);
        setIsCredit(false);
        setMethod("");
      }
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

  const checkOut = () => {
    if (method === "") {
      Toast("Bạn chưa chọn phương thức thanh toán", "warning", "top-right");
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
                <Image source={require("../../../assets/images/credit-card.png")} style={styles.iconPayment} />
              </View>
              <Text fontSize="lg">Thẻ tín dụng</Text>
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
        </View>

        <View style={styles.promoCodeContainer}>
          <Text fontSize="lg" style={{ marginBottom: 5 }}>Mã giảm giá</Text>
          <Input
            type={"text"}
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
    height: 18.6,
    width: 30,
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