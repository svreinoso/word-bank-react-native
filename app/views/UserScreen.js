import React from 'react';
import { Button, View, Text, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import { LoginManager  } from 'react-native-fbsdk';

class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      fullName: '',
      photoURL: ''
    }
  }

  static navigationOptions = {
    title: 'User',
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
  };

  componentDidMount() {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', (response) => {
      const userInfo = JSON.parse(JSON.stringify(response));
      console.warn(userInfo);
      this.setState({
        email: userInfo.email,
        fullName: userInfo.displayName,
        photoURL: userInfo.photoURL ? userInfo.photoURL : 'https://facebook.github.io/react-native/docs/assets/favicon.png'
      });
    }, (error) => {
      console.warn(error);
    });
  }

  logout() {
    firebase.auth().signOut();
    LoginManager.logOut();
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image style={{width:100,height:100,marginLeft:15,justifyContent: 'center'}} 
          source={{uri: this.state.photoURL}} />
        <Text>{this.state.email}</Text>
        <Text>{this.state.fullName}</Text>
        <Button
          title="Logout"
          onPress={() => this.logout()}
        />
      </View>
    );
  }
}

export default UserScreen;