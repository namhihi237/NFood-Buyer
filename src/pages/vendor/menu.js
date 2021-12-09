import { Actionsheet, Text, View, Input, useDisclose, Heading, Center } from "native-base";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { numberOfCarts, listCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import { SCREEN } from "../../constants"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY } from "../../graphql";
import { moneyUtils } from "../../utils"
import Order from "./order";
import { Toast } from "../../components";

export default function Menu(props) {
  const navigation = useNavigation();
  const { menu, vendorId } = props;
  const { isOpen, onOpen, onClose } = useDisclose()
  const [itemMenu, setItemMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [number, setNumber] = useRecoilState(numberOfCarts);
  const [carts, setCarts] = useRecoilState(listCarts);

  const renderListMenu = () => {
    return menu.map((item, index) => {
      return (
        <View style={styles.categoryContainer}>
          <Text style={styles.textTitleCategory}>{item.name?.toUpperCase()}</Text>
          <View style={styles.viewListMenu}>
            {item.items.map((itemMenu, index) => {
              return itemMenu.isActive ? (
                <TouchableOpacity onPress={() => {
                  setItemMenu(itemMenu);
                  onOpen();
                }}
                  style={styles.viewItemMenu}>
                  <View style={styles.viewImageItemMenu}>
                    <Image
                      style={styles.imageItemMenu}
                      source={{ uri: itemMenu.image }}
                    />
                  </View>
                  <View style={styles.viewTextItemMenu}>
                    <Text style={styles.textItemMenu} isTruncated={true}>{itemMenu.name}</Text>
                    <Text style={styles.textPriceItemMenu}>{moneyUtils.convertVNDToString(itemMenu.price)} đ</Text>
                    <Text style={styles.textDescription} isTruncated={true} noOfLines={2}>{itemMenu.description}</Text>
                  </View>
                </TouchableOpacity>
              ) : null
            })}
          </View>
        </View>
      )
    })
  }

  const reduceQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const [addToCart] = useMutation(MUTATION.ADD_TO_CART, {
    variables: {
      vendorId: vendorId,
      itemId: itemMenu?._id,
      quantity
    },
    onCompleted: (data) => {
      Toast("Đã thêm vào giỏ hàng", 'success', 'top-right')
      setItemMenu(null);
      setQuantity(1);
      setNumber(number + quantity);
      setCarts(carts.concat(data.addToCart));
      onClose();

    },
    onError: (error) => {
      Toast(error.message, "danger", 'top-right');
      setItemMenu(null);
      setQuantity(1);
      onClose();
    }

  });

  return (
    <View style={styles.menuContainer}>
      {renderListMenu()}
      <Actionsheet isOpen={isOpen} onClose={() => {
        setItemMenu(null);
        setQuantity(1);
        onClose();
      }}>
        <Actionsheet.Content>
          <Center>
            <Heading style={styles.textTitle}>Chọn món ăn</Heading>
          </Center>
          <View style={styles.viewItemMenuSheet}>
            <View style={styles.viewImageItemMenu}>
              <Image
                style={styles.imageItemMenu}
                source={{ uri: itemMenu?.image }}
              />
            </View>
            <View style={styles.viewTextItemMenu}>
              <Text style={styles.textItemMenu} isTruncated={true}>{itemMenu?.name}</Text>
              <Text style={styles.textPriceItemMenu}>{moneyUtils.convertVNDToString(itemMenu?.price || 0)} đ</Text>
              <Text style={styles.textDescription} isTruncated={true} noOfLines={2}>{itemMenu?.description}</Text>
            </View>
          </View>
          <Input
            mx="3"
            placeholder="Nhập ghi chú (nếu có)"
            w={{ base: "94%", md: "25%" }}
          />
          <View style={styles.line}>
          </View>
          <Order quantity={quantity} price={itemMenu?.price}
            reduce={reduceQuantity}
            increase={() => setQuantity(quantity + 1)}
            addToCart={addToCart}
          />
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    marginTop: 3,
  },
  categoryContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
  },
  textTitleCategory: {
    fontFamily: "Avenir Book",
    color: '#444251',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  imageItemMenu: {
    width: wp('26%'),
    height: wp('26%'),
    borderRadius: 8,
  },
  textItemMenu: {
    fontFamily: "Avenir Book",
    color: '#444251',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  textPriceItemMenu: {
    fontFamily: "Avenir Book",
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  viewItemMenu: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  viewImageItemMenu: {
    marginRight: wp('5%'),
  },
  textDescription: {
    fontFamily: "Avenir Book",
    color: '#959ba4',
    fontSize: 14,
  },
  textTitle: {
    fontFamily: "Avenir Book",
    color: '#444251',
    fontSize: 18,
    marginBottom: 20,
  },
  viewItemMenuSheet: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    width: wp('90%')
  },
  line: {
    height: 1,
    backgroundColor: '#b2b6bb',
    marginBottom: hp('2%'),
    width: wp('100%'),
    marginTop: 20
  }
});