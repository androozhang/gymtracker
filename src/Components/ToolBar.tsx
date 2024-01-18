import { View, Text } from 'react-native'
import React from 'react'
import Home from '../Screens/HomeScreen'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Toolbar = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  )
}

export default Toolbar