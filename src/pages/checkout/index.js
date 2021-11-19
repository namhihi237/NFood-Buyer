import { Text, Input, View, Checkbox, Button } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom } from "../../components";
import { moneyUtils } from "../../utils";


export default function Checkout(props) {

  const checkPromoCode = () => { }

  return (
    <View style={styles.container} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <View>
        <HeaderBack title={"Đặt hàng & thanh toán"} />
        <Text fontSize="xl" bold style={{ ...styles.textTitle, marginTop: 10, marginBottom: 10 }}>Đơn Hàng Sẽ được giao đến</Text>
        <View style={styles.infoContainer}>
          <Text fontSize="md">Lê Trung Nam</Text>
          <Text fontSize="md">120 Nguyễn Lương Bằng, hoa khanh bac, lien chieu, da nang</Text>
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
            <Checkbox colorScheme="orange" style={{ marginTop: 12 }} />
          </View>
          <View style={styles.leftContainer}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <Image source={require("../../../assets/images/cod.png")} style={{ width: 30, height: 30 }} />
              </View>
              <Text fontSize="lg">Thanh toán khi nhận hàng</Text>
            </View>
            <Checkbox colorScheme="orange" style={{ marginTop: 12 }} />
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
            InputRightElement={
              <Button size="xs" rounded="none" w="1/6" h="full" onPress={checkPromoCode}>
                {"Áp dụng"}
              </Button>
            }

          />
        </View>
      </View>
      <View style={styles.checkoutContainer}>
        <View style={styles.totalText}>
          <View style={styles.checkoutText}>
            <Text fontSize="lg">Phí giao hàng</Text>
            <Text fontSize="lg">{moneyUtils.convertVNDToString(10000)} đ</Text>
          </View>
          <View style={styles.checkoutText}>
            <Text fontSize="lg">Tổng mặt hàng</Text>
            <Text fontSize="lg">{moneyUtils.convertVNDToString(100000)} đ</Text>
          </View>
          <View style={styles.checkoutText}>
            <Text fontSize="lg">Giảm giá</Text>
            <Text fontSize="lg">{moneyUtils.convertVNDToString(2000)} đ</Text>
          </View>
          <Text isTruncated={true}>............................................................................................................</Text>
          <View style={styles.checkoutText}>
            <Text bold fontSize="xl">Tổng cộng</Text>
            <Text bold fontSize="xl">{moneyUtils.convertVNDToString(110000)} đ</Text>
          </View>
        </View>

        <ButtonCustom title="Xác nhận thanh toán" style={{ marginTop: 23 }} width={"90%"} height={"7%"} />
      </View>
    </View>
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
  checkoutContainer: {
    backgroundColor: '#fff',
    height: hp('32%'),
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    paddingHorizontal: wp('4%'),
    paddingTop: 25,
    opacity: 1,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },

  },
  checkoutText: {
    display: 'flex',
    flexDirection: 'row',
    width: wp('90%'),
    justifyContent: 'space-between',
    marginTop: 5
  },
  promoCodeContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: 15
  },
  infoContainer: {
    paddingHorizontal: wp('5%'),
  }


});