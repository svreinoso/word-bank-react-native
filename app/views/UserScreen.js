import React, {useState, useEffect} from 'react';
import { Button, View, Text, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import { LoginManager  } from 'react-native-fbsdk';

function UserScreen ({ route, navigation }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

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
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', (response) => {
      const userInfo = JSON.parse(JSON.stringify(response));
      setEmail(userInfo.email);
      setFullName(userInfo.displayName);
      const url = userInfo.photoURL ? 
        userInfo.photoURL : 'https://facebook.github.io/react-native/docs/assets/favicon.png'
      setPhotoUrl(url)
    }, (error) => {
      console.warn(error);
    });
  }

  useEffect(() => {
    loadUser()
  }, [])

  const logout = () => {
    const ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/words/`);
    // ref.off('child_removed')
    // ref.off('child_added')
    // ref.off('child_changed')
    firebase.auth().signOut();
    LoginManager.logOut();
    navigation.navigate('Login');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image style={{width:100,height:100,marginLeft:15,justifyContent: 'center'}} 
        source={{photoUrl}} />
      <Text>{email}</Text>
      <Text>{fullName}</Text>
      <Button
        title="Logout"
        onPress={() => logout()}
      />
    </View>
  );
}

export default UserScreen;