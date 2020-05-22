/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';

import React, { Component } from 'react';
import HomeScreen from './app/views/HomeScreen';
import DetailsScreen from './app/views/DetailsScreen';
import LoginScreen from "./app/views/LoginScreen";
import RegisterScreen from "./app/views/RegisterScreen";
import AddWordScreen from "./app/views/AddWordScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import UserScreen from './app/views/UserScreen';
import { MenuProvider } from 'react-native-popup-menu';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditWord from './app/views/EditWord';

// const RootStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Details: DetailsScreen,
//     Login: LoginScreen,
//     Register: RegisterScreen,
//     AddWord: AddWordScreen,
//     User: UserScreen
//   },
//   {
//     initialRouteName: 'Home',
//   }
// );
// const AppContainer = createAppContainer(RootStack);

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
          <Stack.Screen name="AddWord" component={AddWordScreen} />
          <Stack.Screen name="EditWord" component={EditWord} />
          <Stack.Screen name="User" component={UserScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
  // return (
  //   <NavigationContainer>
  //     <MenuProvider>
  //       <AppContainer />
  //    </MenuProvider>
  //   </NavigationContainer>
  // );
}

// const AppContainer = createAppContainer(RootStack);

// export default class App extends React.Component {
//   render() {
//     // return <AppContainer />;
//     return <MenuProvider>
//       <AppContainer />
//     </MenuProvider>
//   }
// }
