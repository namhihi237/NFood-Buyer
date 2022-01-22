import { Text, Button, View, Modal } from "native-base";

import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';

import { Search, Cart } from '../../components';
import { SCREEN } from "../../constants"
import { GPSUtils } from "../../utils";
import { gps, locationGPS, numberOfCarts, myAddress } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import { MUTATION, QUERY } from "../../graphql";
import Address from "./address";
import Popular from "./popular";
import Category from "./Category";
import Vendor from "./Vendor";
const popular = [
  {
    _id: 1,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "15000",
    rating: 3
  },
  {
    _id: 2,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "20000",
    rating: 3
  },
  {
    _id: 3,
    name: "Cà phê sữa",
    image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633193124/DoAnTN/ts_vhxmax.jpg",
    price: "25000",
    rating: 3
  }
];

const dataL = [{ _id: 1, name: "Bánh mỳ", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633184768/DoAnTN/food_d4tzno.png" },
{ _id: 2, name: "Sinh tố", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633190410/DoAnTN/Group_1217_a2nt2y.png" },
{ _id: 3, name: "Kem", image: "https://res.cloudinary.com/do-an-cnpm/image/upload/v1633190576/DoAnTN/Group_1173_megwgj.png" }];
export default function Home(props) {

  const [isGPS, setIsGPS] = useRecoilState(gps);
  const [location, setLocation] = useRecoilState(locationGPS);
  const [address, setAddress] = useRecoilState(myAddress);
  const [modalVisible, setModalVisible] = React.useState(!isGPS);
  const [numberCart, setNumberCarts] = useRecoilState(numberOfCarts);
  const getLocation = async () => {
    try {
      const status = await GPSUtils.requestPermission();
      if (status === 'already-enabled') {
        setModalVisible(false);
        const location = await GPSUtils.getCurrentPosition();
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
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getLocation();
    }, 1000);

    // clear setTimeout
    return () => {
      clearTimeout();
    };
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
      distance: 20, //km,
    },
    fetchPolicy: 'first-cache',
    onCompleted: (data) => {
      setNumberCarts(data.getQuantityOfCart);
    }
  });

  const renderPopularItem = (item) => {
    return (<Popular item={item} />);
  }

  const keyExtractor = item => item?._id;

  const renderCategoryItem = (item, index) => (
    <Category item={item} key={item._id} />
  );

  const renderVendorItem = (item) => (
    <Vendor item={item} />
  );

  const renderContent = () => {
    return (
      <View>
        <ScrollView style={styles.container}>
          <FlatList
            key="1"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
            renderItem={(item, index) => renderCategoryItem(item, index)}
            keyExtractor={keyExtractor}
            data={dataL}
          />

          <View style={styles.popularTitle}>
            <TouchableOpacity>
              <Text bold fontSize="lg" style={styles.text}>ĐỒ ĂN PHỔ BIẾN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN.NEAR_VENDOR)}>
              <Text bold fontSize="md" style={styles.textAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            key="2"
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
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN.NEAR_VENDOR)}>
              <Text bold fontSize="md" style={styles.textAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            key="3"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.popularList}
            renderItem={renderVendorItem}
            keyExtractor={keyExtractor}
            data={data?.vendors?.items}
          />


        </ScrollView >
        <Cart number={numberCart} />
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