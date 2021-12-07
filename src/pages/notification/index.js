import { Text, Pressable, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { Header, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";

export default function Notification(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const { data } = useQuery(QUERY.GET_NOTIFICATIONS, {
    variables: {
      userType: "buyer",
      skip: 0,
      limit: 100
    },
  });

  const renderItem = (item) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingTop: 10 }}>
          <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('20%'), height: wp('20%'), marginLeft: wp('4%') }} />
          <View style={{ marginRight: 10, paddingRight: wp('24%') }}>
            <Text style={{ fontSize: wp('3.4%'), marginTop: hp('1%') }}>{item.content}</Text>
          </View>
        </View>
        <View style={{ height: 2 }} />
      </View>
    )
  }

  return (
    <View style={styles.container} >
      <Header title="Thông báo" onPress={() => navigation.navigate(SCREEN.HOME)} />
      <FlatList
        style={{}}
        data={data ? data.getNotifications.items : []}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item._id}

      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

});