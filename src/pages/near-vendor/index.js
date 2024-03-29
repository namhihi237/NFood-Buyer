import { Text, View } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, Search } from "../../components";
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { QUERY } from "../../graphql";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { vendorUtils } from '../../utils';
import _ from 'lodash';

export default function PopularList(props) {

  const navigation = useNavigation();
  const [keyword, setKeyword] = React.useState('');

  const onChangeKeyword = (keyword) => setKeyword(keyword);

  const onChangeKeywordDebounce = _.debounce(onChangeKeyword, 1000);

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
              <Text fontSize="xs" >{item.name}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderLike = (item) => {
    const likePercent = parseInt(item.rating / item.numberOfReviews);
    if (!likePercent || likePercent.toString() === 'NaN') {
      return 100;
    }
    return likePercent;
  }

  const renderItem = ({ item }) => {
    return (<TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate(SCREEN.VENDOR, {
      vendor: item
    })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View pl="2" pr="2" style={styles.cardRight}>
        <Text fontSize="lg" bold isTruncated={true} noOfLines={1} >{item.name}</Text>
        <View style={styles.like}>
          <FontAwesome5 name="map-marker" size={16} color="#047857" />
          <Text ml="2">{parseFloat(item?.distance / 1000).toFixed(1)} km</Text>
        </View>
        <Text fontSize="sm" italic isTruncated={true} noOfLines={1}>{item.address}</Text>
        <View style={styles.like}>
          <View style={styles.like}>
            <FontAwesome5 name="thumbs-up" size={16} color="#005db4" />
            <Text ml="2">{renderLike(item)}%</Text>
          </View>
          <Text style={{ color: vendorUtils.checkOpen(item).isOpen ? '#15803d' : '#959BA4' }} ml="4">{vendorUtils.checkOpen(item).text}</Text>
        </View>
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
      <Search onChangeText={onChangeKeywordDebounce} onPress={refetch} placeholder="Bạn muốn ăn gì?" />
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
    backgroundColor: '#fff',
  },
  cardContainer: {
    marginHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 18,
    marginRight: wp('5%'),
    flexDirection: 'row',
  },
  image: {
    height: wp('27%'),
    width: wp('27%'),
    borderRadius: 18,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 3,
  },
  tag: {
    backgroundColor: '#FCC342',
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 6,
  },
  cardRight: {
    justifyContent: 'space-between',
    maxWidth: wp('65%'),
  },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('5%'),
  }

});