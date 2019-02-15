import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image, 
  Picker,
  Alert
}
from 'react-native';
import firebase from 'react-native-firebase';

export default class AddWordScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      word: '',
      translate: '',
      status: '',
      key: '',
      createdDate: ''
    }
  }

  componentDidMount() {
    const wordToEdit = this.props.navigation.getParam('word');
    if (wordToEdit) {
      this.setState({
        word: wordToEdit.word,
        translate: wordToEdit.translate,
        status: wordToEdit.status,
        key: wordToEdit.key,
        createdDate: wordToEdit.createdDate
      })
    }
  }
  
  static navigationOptions = {
    title: 'Add Word',
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
  };

  saveWord() {
    const callback = this.props.navigation.getParam('callback');
    let data = {
      word: this.state.word,
      translate: this.state.translate,
      status: this.state.status,
      key: this.state.key,
      createdDate: this.state.createdDate || new Date().getTime(),
      userId: firebase.auth().currentUser.uid
    };

    let promisse = data.key ? firebase.database().ref('words/' + data.key).set(data)
    : firebase.database().ref('words/').push(data);

    promisse.then(response => {
      callback && callback();
      this.props.navigation.navigate('Home', {refreshData: true});
    }).catch(error => {
      console.warn('error registering: ', error);
    });
    
  }

  onClickListener = (viewId) => {
    switch (viewId) {
      case 'save':
        this.saveWord();
        break;
  
      default:
        break;
    }
  }

  render() {

    return (
      <View style={styles.container}>
      
        <View style={styles.inputContainer}>
          <Text style={{paddingLeft: 10}}>Word:</Text>
          <TextInput style={styles.inputs}
            placeholder="Word"
            keyboardType = "default"
            underlineColorAndroid='transparent'
            returnKeyType='next'
            value={this.state.word}
            onChangeText={(word) => this.setState({word})}
            />
        </View>
        
        <View style={styles.inputContainer}>
          <Text  style={{paddingLeft: 10}}>Translate:</Text>
          <TextInput style={styles.inputs}
            placeholder = "Translate"
            keyboardType = "default"
            underlineColorAndroid='transparent'
            value={this.state.translate}
            onChangeText={(translate) => this.setState({translate})}
            />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={{paddingLeft: 10}}>Status:</Text>
          <Picker style={styles.inputs}
            selectedValue={this.state.status}
            onValueChange={(itemValue, itemIndex) => this.setState({status: itemValue})}>
            <Picker.Item label="Added" value="1" />
            <Picker.Item label="Learning" value="2" />
            <Picker.Item label="Learned" value="3" />
          </Picker>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('save')}>
          <Text style={styles.loginText}>Save</Text>
        </TouchableHighlight>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:'80%',
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
