import { Text, View } from "native-base";
import React from "react";
import { StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { Header } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from '@apollo/client';
import { QUERY } from "../../graphql";
import { timeUtils } from '../../utils';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
export default function Notification(props) {

  const navigation = useNavigation();

  const { data, refetch, loading } = useQuery(QUERY.GET_NOTIFICATIONS, {
    variables: {
      userType: "buyer",
      skip: 0,
      limit: 100
    },
  });

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);


  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(SCREEN.ORDER_DETAIL, {
        orderId: item.orderId
      })}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingTop: 10 }}>
          <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('20%'), height: wp('20%'), marginLeft: wp('4%') }} />
          <View style={{ marginRight: 10, paddingRight: wp('24%') }}>
            <Text style={{ fontSize: wp('3.4%'), marginTop: hp('1%') }}>{item.content}</Text>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ color: '#B2B6BB', fontSize: wp('3%') }} italic>{timeUtils.convertFullTime(new Date(item.createdAt - 0))}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 2 }} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container} >
      <Header title="Thông báo" onPress={() => navigation.navigate(SCREEN.HOME)} />
      {
        loading ?
          (<SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
              <SkeletonPlaceholder.Item marginLeft={20}>
                <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                <SkeletonPlaceholder.Item
                  marginTop={6}
                  width={80}
                  height={20}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>)
          : (<FlatList
            style={{}}
            data={data ? data.getNotifications.items : []}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={item => item._id}

          />)
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

});