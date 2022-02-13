import { Text, View, Actionsheet, useDisclose, } from "native-base";
import React from "react";
import { StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Header, Toast } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
export default function Favorite(props) {

  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose()

  const { data, refetch } = useQuery(QUERY.GET_VENDOR_FAVORITES, {
    fetchPolicy: 'network-only',
  });

  const [removeFavorite] = useMutation(MUTATION.ADD_FAVORITE, {
    onCompleted: (data) => {
      onClose();
      Toast('Đã xóa khỏi danh sách yêu thích');
      refetch();
    }
  });

  const removeFavoriteVendor = async (vendorId) => {
    removeFavorite({
      variables: {
        vendorId,
        isAdd: false
      }
    });
  }

  const renderLike = (item) => {
    const likePercent = parseInt(item?.rating / item?.numberOfReviews);
    if (!likePercent || likePercent.toString() === 'NaN') {
      return 100;
    }
    return likePercent;
  }

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


  const renderItem = (item) => {
    return (
      <View style={styles.cardContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.right}>
          <View>
            <Text fontSize="md" bold>{item?.name}</Text>
            <View style={{ marginTop: 5 }}>
              <Text fontSize="md">{renderLike(item)}% hài lòng</Text>
            </View>
            {renderTag(item.menu)}
          </View>
          <TouchableOpacity style={{ marginTop: 2, width: 5 }} onPress={() => {
            onOpen();
          }}>
            <FontAwesome5 name="ellipsis-v" size={wp('4%')} color="#000" />
          </TouchableOpacity>
        </View>
        <Actionsheet isOpen={isOpen} onClose={() => {
          onClose();
        }}>
          <Actionsheet.Content>
            <TouchableOpacity onPress={() => removeFavoriteVendor(item._id)} style={styles.delete}>
              <FontAwesome5 name="trash" size={wp('4%')} color="#000" />
              <Text ml="4">Gỡ yêu thích</Text>
            </TouchableOpacity>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    )
  }

  return (
    <View style={styles.container} >
      <Header icon="arrow-left" title="Danh yêu thích" onPress={() => navigation.goBack()} />
      <FlatList
        style={{}}
        data={data ? data.getVendorFavorite : []}
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
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 2,

  },
  image: {
    width: wp('30%'),
    height: wp('30%'),
    marginLeft: wp('4%'),
    borderRadius: 10,
  },
  right: {
    marginLeft: 10,
    flexDirection: 'row',
    width: wp('60%'),
    justifyContent: 'space-between',
  },
  cardName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
  delete: {
    flexDirection: 'row',
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