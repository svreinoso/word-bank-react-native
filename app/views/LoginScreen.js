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
import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  updateHeaderBar() {
    this.props.navigation.setOptions(
      {
        title: 'Login',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerRight: () => (
          <View></View>
        ),
        headerLeft: () => (
          <View></View>
        )
      }
    )

  }

  componentDidMount() {
    this.updateHeaderBar()
    AccessToken.getCurrentAccessToken().then(async (data) => {
      await this.setFacebookLogin(data);
    }).catch(() => { });
  }

  setFacebookLogin = async (data) => {
    if (firebase.auth().currentUser) {
      this.props.navigation.navigate('Home');
      return;
    }
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    firebase.auth().signInWithCredential(credential).then(() => {
      this.props.navigation.navigate('Home');
    }).catch(function (error) { })
  }

  // firebase.auth().signInWithCredential(credential).then(currentUser => {
  //   console.log('currentUser: ', currentUser.user);
  //   firebase.database().ref('users/' + currentUser.user.uid).set(currentUser.user).then((result) => {
  //     this.props.navigation.navigate('Home');
  //   }).catch(e => {
  //     console.warn('error creating user in firebase: ', e);
  //   });
  // }).catch(function (error) {
  //   console.log('error signInWithCredential: ', error)
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   var email = error.email;
  //   var credential = error.credential;
  //   if (errorCode === 'auth/account-exists-with-different-credential') {
  //     alert('Email already associated with another account.');
  //   } else {
  //     console.error(error);
  //   }
  // });
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

  setLogin = () => {
    if (!this.state.email) {
      alert('Email is required');
      return;
    }
    if (!this.state.password) {
      alert('Password is required');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        this.props.navigation.navigate('Home');
      }).catch(error => {
        let userNotFound = error.message.indexOf('user-not-found') > -1;
        if (userNotFound) {
          alert('User not found, please register first');
        } else {
          alert('Error verifying the credentials');
        }
        console.log(error.message);
      });
  }

  loginWithFacebook = () => {
    LoginManager.logInWithPermissions(['email']).then((result) => {
      if (result.isCancelled) {
        console.log('Login cancelled');
      } else {
        AccessToken.getCurrentAccessToken().then(async data => {
          if (data) await this.setFacebookLogin(data);
        }).catch(e => {
          console.log('error login with facebook: ', e)
        });
      }
    },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} color="#000" name="user" size={24} />
          <TextInput style={styles.inputs}
            value={this.state.email}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(email) => this.setState({ email })} />
        </View>

        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} color="#000" name="lock" size={24} />
          <TextInput style={styles.inputs}
            value={this.state.email}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password) => this.setState({ password })} />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.setLogin()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.loginWithFacebook()}>
          <Text style={styles.loginText}>Login with facebook</Text>
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
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});