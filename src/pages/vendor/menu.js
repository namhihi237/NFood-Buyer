import { Actionsheet, Text, View, Input, useDisclose, Heading, Center, AlertDialog, Button } from "native-base";
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useMutation, useQuery } from '@apollo/client';
import { numberOfCarts } from "../../recoil/list-state";
import { MUTATION, QUERY } from "../../graphql";
import { useRecoilState } from "recoil";
import { moneyUtils } from "../../utils"
import Order from "./order";
import { Toast } from "../../components";

export default function Menu(props) {
  const { menu, vendorId } = props;
  const { isOpen, onOpen, onClose } = useDisclose()
  const [itemMenu, setItemMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [number, setNumber] = useRecoilState(numberOfCarts);

  const [isOpenAlert, setIsOpenAlert] = React.useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);
  const cancelRef = React.useRef(null);

  const [carts, setCarts] = useState([]);

  useQuery(QUERY.GET_CARTS, {
    onCompleted: (data) => {
      setCarts(data.carts.carts);
    },
    fetchPolicy: 'no-cache',
  })

  const renderBuyQuantity = (id) => {
    if (carts?.length > 0) {
      const index = carts.findIndex(cart => cart.item._id === id);
      if (index !== -1) {
        return (<View style={styles.quantity}>
          <Text style={styles.textQuantity}>x {carts[index].quantity}</Text>
        </View>)
      }
      return null;
    }
    return null;
  }

  const renderListMenu = () => {
    return menu.map((item, index) => {
      return (
        <View style={styles.categoryContainer} key={index}>
          <Text style={styles.textTitleCategory}>{item.name?.toUpperCase()}</Text>
          <View style={styles.viewListMenu}>
            {item.items.map((itemMenu, index) => {
              return itemMenu.isActive ? (
                <TouchableOpacity onPress={() => {
                  setItemMenu(itemMenu);
                  onOpen();
                }}
                  key={index}
                  style={styles.viewItemMenu}>
                  <View style={styles.viewImageItemMenu}>
                    <Image
                      style={styles.imageItemMenu}
                      source={{ uri: itemMenu.image }}
                    />
                  </View>
                  <View >
                    <Text style={styles.textItemMenu} isTruncated={true}>{itemMenu.name}</Text>
                    <Text style={styles.textPriceItemMenu}>{moneyUtils.convertVNDToString(itemMenu.price)} đ</Text>
                    <Text style={styles.textDescription} isTruncated={true} noOfLines={2}>{itemMenu.description}</Text>
                    <View style={styles.quantityContainer}>
                      {renderBuyQuantity(itemMenu._id)}
                    </View>
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

      // check new vendor or existing vendor
      if (carts?.length > 0) {
        if (carts[0]?.vendorId !== vendorId) {
          setCarts([]);
          setNumber(quantity);
        }
      }

      // find  item update carts
      const index = carts.findIndex(cart => cart._id === data.addToCart?._id);

      if (index !== -1) {
        const newCarts = carts.map((cart, index) => {
          if (cart._id === data.addToCart?._id) {
            return data.addToCart;
          }
          return cart;
        })
        setCarts(newCarts);
      } else {
        setCarts([...carts, data.addToCart]);
      }
      onClose();
    },
    onError: (error) => {
      Toast(error.message, "danger", 'top-right');
      setItemMenu(null);
      setQuantity(1);
      onClose();
    }

  });

  const checkAddCart = () => {
    // check new vendor or existing vendor
    if (carts?.length > 0) {
      if (carts[0]?.vendorId !== vendorId) {
        setIsOpenAlert(true);
      } else {
        addToCart();
      }
    } else {
      addToCart();
    }
  }

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
            <View >
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
            addToCart={checkAddCart}
          />
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenAlert} onClose={onCloseAlert} closeOnOverlayClick={false}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            Bạn có muốn đổi cửa hàng?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onCloseAlert} ref={cancelRef}>
                Không
              </Button>
              <Button colorScheme="warning" onPress={() => {
                onCloseAlert();
                addToCart();
              }}>
                Đồng ý
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
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
  },
  quantityContainer: {
    width: wp('60%'),
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  quantity: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 15,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  textQuantity: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});