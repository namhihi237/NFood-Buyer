import { Text, View, Input, Select, CheckIcon } from "native-base";
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Toast, HeaderBack, ButtonCustom } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { timeUtils } from '../../utils';
import { MUTATION } from '../../graphql';

export default function ManageProfile(props) {

  const routes = useRoute();

  const [show, setShow] = useState(false);
  const [birthday, setBirthDay] = useState();
  const [gender, setGender] = useState(routes.params?.user?.gender);
  const [name, setName] = useState(routes.params?.user?.name);
  const [email, setEmail] = useState(routes.params?.user?.email);

  const onchangeName = (name) => setName(name);
  const onChangeEmail = (email) => setEmail(email);

  const navigation = useNavigation();

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    if (event.type === 'set') {
      setShow(false);
      setBirthDay(currentDate);
    }
  };

  const [updateProfile] = useMutation(MUTATION.UPDATE_PROFILE, {
    onCompleted: (data) => {
      navigation.goBack();
    },

    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const updateProfileHandler = () => {
    if (!name) {
      Toast('Vui lòng nhập tên', 'danger', 'top-right');
      return;
    }

    updateProfile({
      variables: { name, email, birthday: birthday?.toString(), gender }
    });

  }

  return (
    <View style={styles.mainContainer}>
      <HeaderBack title="Cập nhật thông tin cá nhân" />
      <View style={styles.content}>
        <View>
          <Text bold>Tên của bạn (*)</Text>
          <Input
            variant="underlined"
            borderColor="#4f4f4f"
            paddingBottom={1}
            paddingTop={1}
            value={name}
            onChangeText={onchangeName} fontSize="md"
          />

          <Text bold mt="4">Email</Text>
          <Input
            variant="underlined"
            borderColor="#4f4f4f"
            paddingBottom={1}
            paddingTop={1}
            value={email}
            onChangeText={onChangeEmail}
            fontSize="md"
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text bold mt="4">Ngày sinh</Text>
              <TouchableOpacity onPress={showDatepicker} style={styles.birth}>
                <FontAwesome5 name="calendar-alt" size={20} color="#4f4f4f" />
                <Text style={{ fontSize: 14, color: '#4f4f4f', marginLeft: 10 }}> {birthday ? timeUtils.convertDate(birthday) : 'Chọn ngày sinh'}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text bold mt="4" mb="1">Giới tính</Text>
              <Select selectedValue={gender} minWidth="30%"
                borderColor={"#4f4f4f"}
                accessibilityLabel="Chọn giới tính" placeholder="Chọn giới tính" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => setGender(itemValue)}>
                <Select.Item label="Male" value="Male" />
                <Select.Item label="Female" value="Female" />
              </Select>
            </View>
          </View>
        </View>

        <ButtonCustom title="Cập nhật thay đổi" width="90%" height="6%" onPress={updateProfileHandler} />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birthday || new Date()}
          mode={'date'}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  birth: {
    flexDirection: 'row',
    marginTop: 10,
    height: 45,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4f4f4f',
    borderRadius: 3,
    paddingHorizontal: 10,
    minWidth: wp('40%'),
    marginRight: 20,
  }

});