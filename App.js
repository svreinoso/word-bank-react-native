/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import HomeScreen  from './app/views/HomeScreen';
import DetailsScreen from './app/views/DetailsScreen';
import LoginScreen from "./app/views/LoginScreen";
import RegisterScreen from "./app/views/RegisterScreen";
import AddWordScreen from "./app/views/AddWordScreen";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
}
from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import UserScreen from './app/views/UserScreen';
import { MenuProvider } from 'react-native-popup-menu';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    AddWord: AddWordScreen,
    User: UserScreen
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    // return <AppContainer />;
    return <MenuProvider>
      < AppContainer / >
    </MenuProvider>
  }
}
