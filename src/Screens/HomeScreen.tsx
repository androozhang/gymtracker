import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import Day from '../components/Day';
import { HomeStackNavigationProp } from '../navigations/types';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

interface RouterProps {
  navigation: HomeStackNavigationProp;
}

const HomeScreen = ({ navigation }: RouterProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('firstSet');
  const [items, setItems] = useState([
    { label: 'First Set', value: 'firstSet' },
    { label: 'Second Set', value: 'secondSet' },
    { label: 'Third Set', value: 'thirdSet' },
  ]);


  const renderDayCard = (day: string) => (
    <TouchableOpacity style={styles.dayCard} onPress={() => navigation.navigate('DayDetail', { day, weekSet: value })}>
      <Text style={styles.dayText}>{day}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row', zIndex: 1, paddingBottom: 0, marginBottom: 0}}>
      <TouchableOpacity
        style={{  alignSelf: 'flex-start', marginTop: 15, marginLeft: '5%', width: '22%'}}
        onPress={() => navigation.navigate('MasterExerciseDirectory')}
      >
        <Ionicons name="list-outline" size={40} color="black" />
      </TouchableOpacity>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        labelStyle={styles.dropdownLabel}
        dropDownContainerStyle={styles.dropdownListContainer}
        
      />
      </View>
      <FlatList
        data={days}
        renderItem={({ item }) => renderDayCard(item)}
        keyExtractor={(item) => item}
        style={{ width: '100%', bottom: '0%'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    top: 50,
    zIndex: 1
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '50%',
    zIndex: 1000,
    shadowColor: 'rgba(0,0,0, 1)', 
    shadowOffset: { height: 3, width: 3 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
  },
  dropdown: {
    
  },
  dropdownLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownListContainer: {
    zIndex: 1000,
  },
  dayCard: {
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    height: 70,
    shadowColor: 'rgba(0,0,0, 1)', 
    shadowOffset: { height: 3, width: 3 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    backgroundColor: '#fff',
    width: '99%',
  },
  dayText: {
    fontSize: 16,
    justifyContent: 'center',
  },
  
});

export default HomeScreen;
