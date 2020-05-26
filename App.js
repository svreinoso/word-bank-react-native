import 'react-native-gesture-handler';

import React from 'react';
import HomeScreen from './app/views/HomeScreen';
import DetailsScreen from './app/views/DetailsScreen';
import LoginScreen from "./app/views/LoginScreen";
import RegisterScreen from "./app/views/RegisterScreen";
import UserScreen from './app/views/UserScreen';
import { MenuProvider } from 'react-native-popup-menu';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditWord from './app/views/EditWord';
import CategoriesScreen from './app/views/CategoriesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EditWord" component={EditWord} />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
