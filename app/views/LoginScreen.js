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
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import { LoginButton, AccessToken, LoginManager  } from 'react-native-fbsdk';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : 'blablabla@gmail.com',
      password: 'Admin1!!',
    }
  }

  componentDidMount() {
    AccessToken.getCurrentAccessToken().then( (data) => {
      this.setFacebookLogin(data);
    });
  }

  static navigationOptions = {
      title: 'Login',
      headerLeft: null,
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
    if(!data) return;
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    firebase.auth().signInWithCredential(credential).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('Email already associated with another account.');
        // Handle account linking here, if using.
      } else {
        console.error(error);
      }
     }).then(x => {
      this.props.navigation.navigate('Home');
     });
    // firebase.auth().signInWithCredential(credential).then((currentUser) => {
    //   console.log(currentUser.user.uid);
    //   firebase.database().ref('users/' + '21').set(currentUser.user).then((result) => {
    //     this.props.navigation.navigate('Home');
    //   }).catch(e => {
    //     console.warn('1 error saving user:', e);
    //   });
    // }).catch(e => {
    //   console.warn('2 error auth:', e.code);
    // });
  }

  setLogin = () => {
      if(!this.state.email) {
        alert('Email is required');
        return;
      }
      if(!this.state.password) {
        alert('Password is required');
        return;
      }
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        this.props.navigation.navigate('Home');
      }).catch(error => {
        let userNotFound = error.message.indexOf('user-not-found') > -1;
        if(userNotFound) {
          alert('User not found, please register first');
        } else {
          alert('Error verifying the credentials');
        }
        console.log(error.message.toString());
      });
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
              value={this.state.email}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              value={this.state.email}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} 
          onPress={() => this.setLogin()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} 
          onPress={() => this.props.navigation.navigate('Register')}>
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