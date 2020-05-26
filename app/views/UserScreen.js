import React, { useState, useEffect } from 'react';
import { Button, View, Text, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import { LoginManager } from 'react-native-fbsdk';

function UserScreen({ route, navigation }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  navigation.setOptions({
    title: 'User',
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
  });

  const loadUser = () => {
    const userInfo = firebase.auth().currentUser;
    setEmail(userInfo.email);
    setFullName(userInfo.displayName);
    const url = userInfo.photoURL ? userInfo.photoURL : ''
    console.log(url)
    setPhotoURL(url)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const logout = () => {
    firebase.auth().signOut();
    LoginManager.logOut();
    navigation.navigate('Login');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image style={{ width: 100, height: 100, marginLeft: 15, justifyContent: 'center' }}
          source={{ uri: photoURL }} />
      <Text>{email}</Text>
      <Text>{fullName}</Text>
      <Button
        title="Categorias"
        onPress={() => navigation.navigate('Categories')}
      />
      <Button
        title="Logout"
        onPress={() => logout()}
      />
    </View>
  );
}

export default UserScreen;