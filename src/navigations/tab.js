import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components';
import { SCREEN } from '../constants';
import { } from '../pages';
const Tab = createBottomTabNavigator();

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


function TabHome() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}
      initialRouteName={SCREEN.NEW_ORDER}
      screenOptions={{
        headerShown: false,
        transitionSpec: { open: config, close: config },
        gestureDirection: 'horizontal',
      }}
    >
      {/* <Tab.Screen name={SCREEN.NEW_ORDER} component={NewOrder} options={{ icon: 'file-invoice' }} />
      <Tab.Screen name={SCREEN.MANAGER} component={Manager} options={{ icon: 'tasks' }} />
      <Tab.Screen name={SCREEN.NOTIFICATION} component={Notification} options={{ icon: 'bell' }} />
      <Tab.Screen name={SCREEN.STORE} component={Store} options={{ icon: 'store' }} /> */}

    </Tab.Navigator>
  );
}

export default TabHome;