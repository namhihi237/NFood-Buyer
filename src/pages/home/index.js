import { Text, Button, Box, View, Modal } from "native-base";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants"
import { GPSUtils } from "../../utils";
import { gps, location } from "../../recoil/list-state";
import { useRecoilState } from "recoil";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { MUTATION } from "../../graphql";

export default function Home(props) {

  const [isGPS, setIsGPS] = useRecoilState(gps);
  const [location, setLocation] = useRecoilState(location);
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = React.useState(!isGPS)

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
    getLocation();
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
  })

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Chào mừng bạn đến với
          </Text>
          <Text style={styles.headerText}>
            Shopee
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.contentItem}>
            <Text style={styles.contentItemText}>
              Địa chỉ giao hàng
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text style={styles.contentItemText}>
                {address ? `${address}` : 'Chưa có vị trí'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentItem}>
            <Text style={styles.contentItemText}>
              Số điện thoại
            </Text>
            <Text style={styles.contentItemText}>
              0987654321
            </Text>
          </View>
          <View style={styles.contentItem}>
            <Text style={styles.contentItemText}>
              Email
            </Text>
            <Text style={styles.contentItemText}>

            </Text>
          </View>
        </View>
      </View>
    )
  }

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      {!isGPS ? renderOpenGPS() : renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: hp("5%")
  },

});