import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
}
from 'react-native';
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager  } from 'react-native-fbsdk';

export default class LoginView extends React.Component {

  constructor(props) {
    super(props);
    state = {
      email   : '',
      password: '',
    }
  }

  componentDidMount() {
    AccessToken.getCurrentAccessToken().then( (data) => {
      this.setFacebookLogin(data);
    });
  }

  static navigationOptions = {
      title: 'Login',
      headerStyle: {
          backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center'
      },
  };

  setFacebookLogin(data) {
    console.warn('currentUser', data);
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    firebase.auth().signInWithCredential(credential).then((currentUser) => {
      console.warn('success', currentUser);
      console.warn(JSON.stringify(currentUser.user.toJSON()))
      firebase.database().ref('users/' + currentUser.user.uid).set(currentUser.user).then((result) => {
        this.props.navigation.navigate('Home');
      }).catch(e => {
        console.warn('error savinr user:', e);
      });
    }).catch(e => {
      console.warn('error auth:', e);
    });
  }

  setLogin() {
      const data = {
        email: this.state.email,
        password: this.state.password
      };
      firebase.auth().signInWithEmailAndPassword(data.email, data.password)
      .then(response => {
        this.props.navigation.navigate('Home');
      }).catch(error => {
        console.warn(error);
      });
    console.warn(data);
  }

  onClickListener = (viewId) => {
    switch (viewId) {
        case 'login':
            this.setLogin();
            break;
        case 'register':
            this.props.navigation.navigate('Register');
            break;
        default:
            break;
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{marginBottom: 15}}>
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.warn("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.warn("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then( (data) => {
                      if (data) this.setFacebookLogin(data);
                  });
                }
              }
            }
            onLogoutFinished={() => console.warn("logout.")}/>
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});