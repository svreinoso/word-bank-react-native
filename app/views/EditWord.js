import React, { useEffect, useState } from 'react';
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
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';



function EditWord({ route, navigation }) {

  const [word, setWord] = useState('')
  const [translate, setTranslate] = useState('')
  const [status, setStatus] = useState('')
  const [key, setKey] = useState('')
  const [createdDate, setCreatedDate] = useState('')

  useEffect(() => {
    const { word } = route.params;
    if(word) {
      setWord(word.name);
      setTranslate(word.translate);
      setStatus(word.status);
      setKey(word.key);
      setCreatedDate(word.createdDate)
    }
  },[])


const saveWord = () => {
  // const callback = this.props.navigation.getParam('callback');
  let data = {
    word,
    translate,
    status,
    key,
    createdDate: createdDate || new Date().getTime(),
    userId: firebase.auth().currentUser.uid
  };

  let promisse = data.key ? firebase.database().ref('words/' + data.key).set(data)
  : firebase.database().ref('words/').push(data);

  promisse.then(response => {
    // callback && callback();
    navigation.navigate('Home', {refreshData: true});
  }).catch(error => {
    console.warn('error registering: ', error);
  });
  
}

  return (
    
    <View style={styles.container}>
      
    <View style={styles.inputContainer}>
      <Text style={{paddingLeft: 10}}>Word:</Text>
      <TextInput style={styles.inputs}
        placeholder="Word"
        keyboardType = "default"
        underlineColorAndroid='transparent'
        returnKeyType='next'
        value={word}
        onChangeText={(word) => setWord(word)}
        />
    </View>
    
    <View style={styles.inputContainer}>
      <Text  style={{paddingLeft: 10}}>Translate:</Text>
      <TextInput style={styles.inputs}
        placeholder = "Translate"
        keyboardType = "default"
        underlineColorAndroid='transparent'
        value={translate}
        onChangeText={(translate) => setTranslate(translate)}
        />
    </View>
    
    <View style={styles.inputContainer}>
      <Text style={{paddingLeft: 10}}>Status:</Text>
      <Picker style={styles.inputs}
        selectedValue={status}
        onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}>
        <Picker.Item label="Added" value="1" />
        <Picker.Item label="Learning" value="2" />
        <Picker.Item label="Learned" value="3" />
      </Picker>
    </View>

    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={saveWord}>
      <Text style={styles.loginText}>Save</Text>
    </TouchableHighlight>

  </View>
  )
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
    borderRadius: 30,
    borderBottomWidth: 1,
    width: '80%',
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

export default EditWord
