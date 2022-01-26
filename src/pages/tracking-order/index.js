import { Text, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { HeaderBack, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { QUERY, MUTATION, SUBSCRIPTION, client } from "../../graphql";
import { TabView, SceneMap } from 'react-native-tab-view';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
export default function TrackingOrder(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const [location, setLocation] = React.useState(null);


  useSubscription(SUBSCRIPTION.GET_LOCATION_SHIPPER, {
    variables: {
      orderId: route.params.orderId
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { data } = subscriptionData;
      if (data.locationShipper) {
        setLocation(data.locationShipper);
      }
    }
  });

  return (
    <View style={styles.container} >
      <HeaderBack title="Vị trí của shipper" />
      <MapView
        initialRegion={{
          latitude: 16.076,
          longitude: 108.14894,
          latitudeDelta: 0.1022,
          longitudeDelta: 0.0721,
        }}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        showsTraffic={false}
        showsBuildings={false}
        showsUserLocation={true}
        minZoomLevel={5}
        showsPointsOfInterest={false}
        showsCompass={false}
      >
        {location && <Marker
          centerOffset={{ x: 25, y: 25 }}
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={
            {
              latitude: location[1],
              longitude: location[0]
            }
          } >
          <Image source={require('../../../assets/images/shipper.png')} style={{ height: 25, width: 25, backgroundColor: 'red', borderRadius: 10 }} />
        </Marker>}
      </MapView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});