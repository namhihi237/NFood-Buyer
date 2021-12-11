import { Text, Pressable, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { TabView, SceneMap } from 'react-native-tab-view';
import Item from './item';

const FirstRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>
const SecondRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>
const ThirdRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>
const FourthRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>
const initialLayout = { width: Dimensions.get('window').width };

export default function ListOrders(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const { data, refetch } = useQuery(QUERY.GET_ORDERS);

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);

  const [index, setIndex] = React.useState(route?.params?.index || 0);
  const [routes] = React.useState([
    { key: 'pending', title: 'Đang chờ' },
    { key: 'shipping', title: 'Đang giao' },
    { key: 'delivered', title: 'Đã nhận' },
    { key: 'cancelled', title: 'Đã hủy' },
  ]);

  const renderItems = (order) => {
    return (<Item order={order} onPress={() => {
      navigation.navigate(SCREEN.ORDER_DETAIL, { orderId: order._id, invoiceNumber: order.invoiceNumber });
    }} />);
  }

  const renderTabOrder = (key) => {
    if (data) {
      let orders = [];
      switch (key) {
        case 'pending':
          orders = data.getOrderByBuyer.filter(order => order.orderStatus === 'Pending');
          break;
        case 'shipping':
          orders = data.getOrderByBuyer.filter(order => order.orderStatus === 'Shipping' || order.orderStatus === 'Processing');
          break;
        case 'delivered':
          orders = data.getOrderByBuyer.filter(order => order.orderStatus === 'Delivered');
          break;
        case 'cancelled':
          orders = data.getOrderByBuyer.filter(order => order.orderStatus === 'Cancelled');
          break;
        default:
          break;
      }

      if (orders.length === 0) {
        return (
          <View style={{ flex: 1 }}>
            <Center flex={1}>
              <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} />
            </Center>
          </View>
        )
      } else {
        return (
          <FlatList
            data={orders}
            renderItem={({ item }) => renderItems(item)}
            keyExtractor={item => item._id}
          />
        )
      }
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Center flex={1}>
            <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: hp('55%') }} />
          </Center>;
        </View>
      )
    }
  }

  const renderPending = () => renderTabOrder('pending');
  const renderShipping = () => renderTabOrder('shipping');
  const renderDelivered = () => renderTabOrder('delivered');
  const renderCanceled = () => renderTabOrder('cancelled');

  const renderSceneNo = SceneMap({
    pending: FirstRoute,
    shipping: SecondRoute,
    delivered: ThirdRoute,
    cancelled: FourthRoute,
  });

  const renderScene = SceneMap({
    pending: renderPending,
    shipping: renderShipping,
    delivered: renderDelivered,
    cancelled: renderCanceled
  });

  const renderTabBar = (props) => {
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const color = index === i ? '#1f2937' : '#a1a1aa';
          const borderColor = index === i ? 'warning.600' : 'coolGray.200';

          return (
            <Box borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3" cursor="pointer">
              <Pressable
                onPress={() => {
                  setIndex(i);
                }}>
                <Text style={{ color }}>{route?.title}</Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    )
  };

  return (
    <View style={styles.container} >
      <HeaderBack title="Đơn hàng của bạn" />
      <TabView
        navigationState={{ index, routes }}
        renderScene={data ? renderScene : renderSceneNo}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ marginTop: StatusBar.currentHeight }}
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