import { Text, Button, Box, View, Modal } from "native-base";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading, Search, Cart } from '../../components';
import { SCREEN } from "../../constants"
import { GPSUtils } from "../../utils";
import { gps, locationGPS, listCarts } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION, QUERY } from "../../graphql";
import Address from "./address";
import Popular from "./popular";
import Category from "./Category";
import Vendor from "./Vendor";
const popular = [
  {
    id: 1,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "15000",
    rating: 4.5
  },
  {
    id: 2,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "20000",
    rating: 4.3
  },
  {
    id: 3,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "25000",
    rating: 4.1
  }
];

const dataL = [{ id: 1, name: "Food", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633184768/DoAnTN/food_d4tzno.png" },
{ id: 2, name: "Juice", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633190410/DoAnTN/Group_1217_a2nt2y.png" },
{ id: 3, name: "Dessert", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633190576/DoAnTN/Group_1173_megwgj.png" }];
export default function Home(props) {

  const [isGPS, setIsGPS] = useRecoilState(gps);
  const [location, setLocation] = useRecoilState(locationGPS);
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = React.useState(!isGPS);
  const [cart, setCart] = useRecoilState(listCarts);
  const getLocation = async () => {

    try {
      const status = await GPSUtils.requestPermission();
      console.log(status);
      if (status === 'already-enabled') {
        setModalVisible(false);
        const location = await GPSUtils.getCurrentPosition();
        console.log(location);

        updateGPSAddressBuyer({
          variables: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
        setIsGPS(true);

        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

      } else if (status === 'enabled') {
        setIsGPS(true);
        setModalVisible(false);
        getLocation();
      }
    } catch (error) {
      Toast('Bạn chưa bật GPS', 'danger', 'top-right');
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getLocation();
    }, 1000);
  }, [])

  const renderOpenGPS = () => {
    return (
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        closeOnOverlayClick={false}
      >
        <Modal.Content>
          <Modal.Header>Chọn địa chỉ giao hàng</Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  getLocation();
                }}
              >
                Lấy vị trí
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  const [updateGPSAddressBuyer] = useMutation(MUTATION.SET_LOCATION_BUYER, {
    onCompleted: (data) => {
      setAddress(data.updateGPSAddressBuyer);
    },
  });

  const { data } = useQuery(QUERY.VENDORS, {
    variables: {
      latitude: location.latitude,
      longitude: location.longitude,
      distance: 20 //km
    },
    fetchPolicy: 'first-cache',
    onCompleted: (data) => {
      setCart(data.carts);
    }
  });

  const renderPopularItem = (item) => {
    return (<Popular item={item} />);
  }

  const keyExtractor = item => item?._id;

  const renderCategoryItem = (item) => (
    <Category item={item} />
  );

  const renderVendorItem = (item) => (
    <Vendor item={item} />
  );

  const renderContent = () => {
    return (
      <View>
        <ScrollView style={styles.container}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
            renderItem={renderCategoryItem}
            keyExtractor={keyExtractor}
            data={dataL}
          />

          <View style={styles.popularTitle}>
            <TouchableOpacity>
              <Text bold fontSize="lg" style={styles.text}>ĐỒ ĂN PHỔ BIẾN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN.POPULAR_LIST)}>
              <Text bold fontSize="md" style={styles.textAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.popularList}
            renderItem={renderPopularItem}
            keyExtractor={keyExtractor}
            data={popular}
          />

          <View style={styles.popularTitle}>
            <TouchableOpacity>
              <Text bold fontSize="lg" style={styles.text}>QUÁN GẦN BẠN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN.POPULAR_LIST)}>
              <Text bold fontSize="md" style={styles.textAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.popularList}
            renderItem={renderVendorItem}
            keyExtractor={keyExtractor}
            data={data?.vendors?.items}
          />


        </ScrollView >
        <Cart number={data?.getQuantityOfCart} />
      </View>

    )
  }

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Address address={address || ""} />
      {!isGPS ? renderOpenGPS() : renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  mainContainer: {
    // backgroundColor: '#D7D9DB',
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  popularTitle: {
    paddingHorizontal: wp("5%"),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp("1%"),
  },
  popularList: {
    height: hp("31%"),
    marginTop: 10,
    marginBottom: 10
  },
  text: {
    color: '#444251',
  },
  categoryList: {
    height: 80,
    paddingTop: hp("2%"),
  },
  textAll: {
    color: '#36AFDC'
  }
});