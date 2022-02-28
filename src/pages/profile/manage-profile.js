import { Text, View } from "native-base";
import React from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Toast, HeaderBack } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, MUTATION } from '../../graphql';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { createFormData, timeUtils } from '../../utils';

const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1646043555/DoAnTN/user1_ougwyl.png";

export default function ManageProfile(props) {

  let [photo, setPhoto] = React.useState('');
  const navigation = useNavigation();

  const { data, refetch } = useQuery(QUERY.GET_USER, {
    fetchPolicy: "network-only",
    variables: {
      role: "buyer"
    },
  });

  const [updateProfile] = useMutation(MUTATION.UPDATE_PROFILE);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets) {
        setPhoto(response.assets[0]);
        uploadImage();
      }
    });
  };
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);

  const [uploadImage] = useLazyQuery(QUERY.GET_SIGNATURE, {
    fetchPolicy: 'no-cache',
    onCompleted: async (data) => {
      const link = data.getSignatureImage;
      try {
        const upload = await axios.post(link, createFormData(photo), {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        let image1 = upload.data.secure_url || null;
        if (!image1) {
          Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
          return;
        }
        // update image db
        updateProfile({ variables: { image: image1 } });
      } catch (error) {
        Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
      }
    },
    onError: (error) => {
      Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
    }
  });

  return (
    <View style={styles.mainContainer}>
      <HeaderBack title="Quản lý hồ sơ" />
      <View>
        <View style={styles.avatarContainer}>
          <TouchableWithoutFeedback onPress={handleChoosePhoto}>
            <Image source={{ uri: photo ? photo?.uri : data?.getUser?.image ? data?.getUser?.image : noImage }} style={styles.image} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text bold fontSize="md">Thông tin cá nhân</Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREEN.UPDATE_PROFILE, {
              user: data?.getUser
            })}>
              <Text color="#0891b2">Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="user-alt" size={16} color="#000" />
            <Text ml="4">{data?.getUser?.name}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="envelope" size={16} color="#000" />
            <Text ml="4">{data?.getUser?.email || 'Chưa cập nhật'}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="birthday-cake" size={16} color="#000" />
            <Text ml="4">{timeUtils.convertDate(new Date(data?.getUser?.birthday - 0)) || 'Chưa cập nhật'}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="venus-mars" size={16} color="#000" />
            <Text ml="4">{data?.getUser?.gender || 'Chưa cập nhật'}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text bold fontSize="md">Số điện thoại liên lạc</Text>
            <TouchableOpacity>
              <Text color="#0891b2">Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <FontAwesome5 name="phone" size={16} color="#000" />
            <Text ml="4">{data?.getUser?.phoneNumber}</Text>
          </View>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  avatarContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('3%'),
  },
  image: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('15%'),
  },
  infoContainer: {
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    paddingVertical: hp('1%'),
    marginTop: hp('1%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  }

});