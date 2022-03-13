import { Text, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { QUERY, MUTATION, SUBSCRIPTION, client } from "../../graphql";
import { moneyUtils, orderUtils, timeUtils } from '../../utils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Wallet(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const { data, refetch } = useQuery(QUERY.GET_TRANSACTIONS, {
    variables: {
      type: 'buyer',
    },
    fetchPolicy: 'network-only',
  });

  const renderItem = (item) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp('4%') }}>
          <View style={styles.item}>
            <Text mb="2">{'Thanh toán'} </Text>
            <Text fontSize="sm" italic>{timeUtils.convertFullTime(new Date(item.createdAt - 0))}</Text>
          </View>
          <View>
            <Text bold>-{moneyUtils.convertVNDToString(item.amount)} đ</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#d4d4d4', marginHorizontal: wp('4%'), marginTop: 10 }}></View>
      </View>

    )
  }

  return (
    <View style={styles.container} >
      <HeaderBack icon="arrow-left" title="Ví của tôi" onPress={() => navigation.goBack()} />
      <View>
        <View style={styles.balanceContainer} >
          <View style={styles.balancePanel} >
            <Text color="#fff" fontSize="xl">Số dư trong ví</Text>
            <Text fontSize="3xl" color="#fff">{moneyUtils.convertVNDToString(route.params?.money)} đ</Text>
          </View>
        </View>
        {/* <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="wallet" size={wp('7%')} color="#F24F04" style={styles.icon} />
            <Text style={styles.text}>Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="credit-card" size={wp('7%')} color="#F24F04" style={styles.icon} />
            <Text style={styles.text}>Rút tiền</Text>
          </TouchableOpacity>
        </View> */}
        {
          data?.getTransactions?.length > 0 ? (<FlatList
            data={data?.getTransactions || []}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item) => item._id}
          />) : <View><Text>Bạn chưa có giao dịch nào</Text></View>
        }
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
  },
  balanceContainer: {
    backgroundColor: '#F24F04',
  },
  balancePanel: {
    padding: 20,
    alignItems: 'center'
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,

  },
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  history: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
  }

});