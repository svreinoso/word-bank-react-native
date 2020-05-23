import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  // Picker,
  Alert
} from 'react-native';
// import {Picker} from '@react-native-community/picker';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';

function EditWord({ route, navigation }) {

  const [word, setWord] = useState('')
  const [translate, setTranslate] = useState('')
  const [status, setStatus] = useState('1')
  const [key, setKey] = useState('')
  const [createdDate, setCreatedDate] = useState('')

  useEffect(() => {
    const { word } = route.params;
    if (word) {
      setWord(word.word);
      setTranslate(word.translate);
      setStatus(word.status);
      setKey(word.key);
      setCreatedDate(word.createdDate)
    }
  }, [])


  const saveWord = () => {
    let data = {
      word,
      translate,
      status,
      key,
      createdDate: createdDate || new Date().getTime()
    };
    const url = `users/${firebase.auth().currentUser.uid}/words/`;
    let promisse = data.key ? firebase.database().ref(url + data.key).set(data)
      : firebase.database().ref(url).push(data);

    promisse.then(response => {
      navigation.navigate('Home', { refreshData: true });
    }).catch(error => {
      console.error('error registering: ', error);
    });

  }

  return (

    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={{ paddingLeft: 10, width: 80 }}>Word:</Text>
        <TextInput style={styles.inputs}
          placeholder="Word"
          keyboardType="default"
          underlineColorAndroid='transparent'
          returnKeyType='next'
          value={word}
          onChangeText={(word) => setWord(word)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ paddingLeft: 10, width: 80 }}>Translate:</Text>
        <TextInput style={styles.inputs}
          placeholder="Translate"
          keyboardType="default"
          underlineColorAndroid='transparent'
          value={translate}
          onChangeText={(translate) => setTranslate(translate)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ paddingLeft: 10, width: 80 }}>Status:</Text>
        <View style={{
          width: '70%',
          height: 50,
          justifyContent: 'center',
          paddingLeft: 10
        }}>
          <RNPickerSelect
            value={status}
            style={styles.inputs}
            onValueChange={(value) => setStatus(value)}
            items={[
              { label: 'Added', value: '1' },
              { label: 'Learning', value: '2' },
              { label: 'Learned', value: '3' },
            ]}
            Icon={() => {
              return <Icon style={{top: -5}} color="#000" name="chevron-down" size={24} onPress={() => { }} />
            }}
          />
        </View>
      </View>

      <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={saveWord}>
        <Text style={styles.loginText}>Save</Text>
      </TouchableHighlight>

    </View>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

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
