import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREEN } from '../constants';
import {
  Login,
  Register,
  RegisterBuyer,
  Vendor,
  Cart,
  AuthPhone,
  Checkout,
  NearVendor,
  ListOrders,
  TrackingOrder,
  OrderDetail,
  ReviewShipper,
  ReviewVendor,
  Wallet,
  Favorite,
  Forgot,
  CheckCode,
  UpdatePassword,
  PromotionList
} from '../pages';

import Tab from './tab';
const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREEN.LOGIN}
        screenOptions={{
          headerShown: false,
          transitionSpec: { open: config, close: config },
          gestureDirection: 'horizontal',
        }}>
        <Stack.Screen name={SCREEN.LOGIN} component={Login} />
        <Stack.Screen name={SCREEN.REGISTER} component={Register} />
        <Stack.Screen name={SCREEN.AUTH_PHONE} component={AuthPhone} />
        <Stack.Screen name={SCREEN.TAB} component={Tab} />
        <Stack.Screen name={SCREEN.REGISTER_BUYER} component={RegisterBuyer} />
        <Stack.Screen name={SCREEN.VENDOR} component={Vendor} />
        <Stack.Screen name={SCREEN.CART} component={Cart} />
        <Stack.Screen name={SCREEN.CHECKOUT} component={Checkout} />
        <Stack.Screen name={SCREEN.NEAR_VENDOR} component={NearVendor} />
        <Stack.Screen name={SCREEN.LIST_ORDERS} component={ListOrders} />
        <Stack.Screen name={SCREEN.TRACK_ORDER} component={TrackingOrder} />
        <Stack.Screen name={SCREEN.ORDER_DETAIL} component={OrderDetail} />
        <Stack.Screen name={SCREEN.REVIEW_SHIPPER} component={ReviewShipper} />
        <Stack.Screen name={SCREEN.REVIEW_VENDOR} component={ReviewVendor} />
        <Stack.Screen name={SCREEN.WALLET} component={Wallet} />
        <Stack.Screen name={SCREEN.FAVORITE} component={Favorite} />
        <Stack.Screen name={SCREEN.FORGOT_PASSWORD} component={Forgot} />
        <Stack.Screen name={SCREEN.CHECK_CODE} component={CheckCode} />
        <Stack.Screen name={SCREEN.UPDATE_PASSWORD} component={UpdatePassword} />
        <Stack.Screen name={SCREEN.PROMOTION_VENDOR} component={PromotionList} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
