import { Text, FormControl, View, Modal, Button, Input } from "native-base";
import React, { useState } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Toast } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, MUTATION } from '../../graphql';
import { storageUtils } from '../../utils';

const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1637807216/user_ilxv1x.png";

export default function Store(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onChangePassword = (text) => setPassword(text);
  const onChangeNewPassword = (text) => setNewPassword(text);

  const { data } = useQuery(QUERY.GET_USER, {
    fetchPolicy: "cache-first",
    variables: {
      role: "buyer"
    },
  });

  const [changePassword] = useMutation(MUTATION.CHANGE_PASSWORD, {
    variables: {
      oldPassword: password,
      newPassword: newPassword
    },
    onCompleted: (data) => {
      setModalVisible(false);
      Toast('Đổi mật khẩu thành công', 'success', 'top-right');
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const changePasswordHandler = async () => {
    // validate password
    if (password === '' || newPassword === '') {
      Toast('Vui lòng nhập đầy đủ thông tin', 'danger', 'top-right');
      return;
    }

    // new password > 6 characters
    if (newPassword.length < 6) {
      Toast('Mật khẩu mới phải có ít nhất 6 ký tự', 'danger', 'top-right');
      return;
    }

    // check 2 password dont  same password
    if (password === newPassword) {
      Toast('Mật khẩu mới không được trùng với mật khẩu cũ', 'danger', 'top-right');
      return;
    }

    await changePassword();
  }


  const navigation = useNavigation();

  const logOut = async () => {
    await storageUtils.removeItem("token");
    await storageUtils.removeItem("phoneNumber");
    await storageUtils.removeItem("password");
    navigation.navigate(SCREEN.LOGIN, { clear: true });
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <FontAwesome5 name="cog" size={hp('2.6%')} color="#fff" style={{ marginRight: 15 }} />
          <FontAwesome5 name="shopping-cart" size={hp('2.6%')} color="#fff" onPress={() => navigation.navigate(SCREEN.CART)} />
        </View>
        <View style={styles.info}>
          <Image source={{ uri: data ? data?.getUser.avatar || noImage : noImage }} style={styles.avatar} />
          <View >
            <Text style={styles.name}>{data?.getUser.name}</Text>
            <Text style={styles.phone}>{data?.getUser.phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View >
        <View style={styles.ordersHeader} >
          <View style={styles.ordersHeaderLeft}>
            <FontAwesome5 name="list-alt" size={hp('2.6%')} color="#3c63b2" style={{ marginRight: 10 }} />
            <Text>Đơn hàng</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS) }}>
            <View style={styles.ordersHeaderLeft}>
              <Text>Tất cả lịch sử mua hàng</Text>
              <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.listOrderContainer}>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 0 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="wallet" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đang chờ</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 1 }) }} >
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="shipping-fast" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đang giao</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 2 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="hand-holding-usd" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đã nhận</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate(SCREEN.LIST_ORDERS, { index: 3 }) }}>
            <View style={styles.orderListIcon}>
              <FontAwesome5 name="window-close" size={hp('2.6%')} color="#000" style={{ marginLeft: 10, marginBottom: 5 }} />
              <Text>Đã hủy</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.navigate(SCREEN.WALLET)}>
          <View style={styles.ordersHeader} >
            <View style={styles.ordersHeaderLeft}>
              <FontAwesome5 name="wallet" size={hp('2.6%')} color="#3c63b2" style={{ marginRight: 10 }} />
              <Text>Ví của tôi</Text>
            </View>
            <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate(SCREEN.FAVORITE)}>
          <View style={styles.ordersHeader} >
            <View style={styles.ordersHeaderLeft}>
              <FontAwesome5 name="heart" size={hp('2.6%')} color="#ec4899" style={{ marginRight: 10 }} />
              <Text>Danh sách cửa hàng yêu thích</Text>
            </View>
            <FontAwesome5 name="angle-right" size={hp('2.6%')} color="#000" style={{ marginLeft: 10 }} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.btnLogout} >
            <View style={styles.ordersHeaderLeft}>
              <Text bold color="#06b6d4">Thay đổi mật khẩu</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={logOut}>
          <View style={styles.btnLogout} >
            <View style={styles.ordersHeaderLeft}>
              <Text bold color="#06b6d4">Đăng xuất tài khoản</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

      </View>

      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        closeOnOverlayClick={false}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Đổi mật khẩu mới</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Mật khẩu hiện tại</FormControl.Label>
              <Input onChangeText={onChangePassword} type='password' />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Mật khẩu mới</FormControl.Label>
              <Input onChangeText={onChangeNewPassword} type='password' />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  changePasswordHandler();
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  header: {
    height: hp('16%'),
    backgroundColor: '#F24F04'
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('5%'),
  },
  avatar: {
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: hp('4%'),
    marginRight: hp('2%'),
    borderWidth: 1,
    borderColor: '#000'
  },
  name: {
    color: '#fff',
    fontSize: hp('2.6%'),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  phone: {
    color: '#fff',
    fontSize: hp('1.7%')
  },
  headerIcon: {
    width: "100%",
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: 2,
    paddingTop: 20,
    paddingBottom: 20,
  },
  ordersHeaderLeft: {
    flexDirection: 'row',
  },
  orderListIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    paddingHorizontal: 10
  },
  listOrderContainer: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  btnLogout: {
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: 2,
    marginTop: 5,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }

});