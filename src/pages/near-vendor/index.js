import { Text, View } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, Search } from "../../components";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from "../../graphql";

export default function PopularList(props) {

  const navigation = useNavigation();
  const [keyword, setKeyword] = React.useState('');

  const onChangeKeyword = (keyword) => setKeyword(keyword);

  const { data, refetch } = useQuery(QUERY.GET_ALL_VENDORS, {
    variables: {
      page: 1,
      limit: 100,
      distance: 500,
      keyword
    },
    fetchPolicy: 'network-only',
  });


  const renderTag = (menu) => {
    return (
      <View style={styles.tagContainer}>
        {menu.map((item, index) => {
          return (
            <View style={styles.tag} key={index}>
              <Text style={styles.tagText}>{item.name}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderItem = ({ item }) => {
    return (<TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate(SCREEN.VENDOR, {
      vendor: item
    })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View pl="2" pr="2">
        <Text bold fontSize="xl" isTruncated={true} noOfLines={2} mt="4">{item.name}</Text>
        <Text fontSize="sm" italic isTruncated={true} noOfLines={2}>{item.address}</Text>
        {renderTag(item.menu)}
      </View>
    </TouchableOpacity>)
  }

  const extractKey = (item) => {
    return item._id
  }

  return (
    <View style={styles.container} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <HeaderBack title={"Quán gần bạn"} />
      <Search onChangeText={onChangeKeyword} onPress={refetch} />
      <FlatList
        data={data?.getAllVendors?.items}
        renderItem={renderItem}
        keyExtractor={extractKey}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 18,
    marginRight: wp('5%'),
    paddingBottom: 15,
  },
  image: {
    height: hp('15%'),
    width: wp('90%'),
    borderRadius: 18,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#FCC342',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 6,
  }

});