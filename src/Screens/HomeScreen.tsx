import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import Day from '../components/Day';
import { HomeStackNavigationProp } from '../navigations/types';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface RouterProps {
  navigation: HomeStackNavigationProp;
}

const HomeScreen = ({navigation}: RouterProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('firstSet');
  const [items, setItems] = useState([
    {label: 'First Set', value: 'firstSet'},
    {label: 'Second Set', value: 'secondSet'},
    {label: 'Third Set', value: 'thirdSet'},
  ]);

  return (
    <>
    <Text>{value}</Text>
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
    <FlatList
      data={days}
      renderItem={({ item }) => <Day day={item} weekSet={value}/>}
      keyExtractor={(item) => item}
    />
    </>
  );
};

export default HomeScreen;