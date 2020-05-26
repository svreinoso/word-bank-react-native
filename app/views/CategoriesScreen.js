import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, Text, Button, Alert } from 'react-native'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const url = `users/${firebase.auth().currentUser.uid}/categories/`;

  const loadData = () => {
    firebase.database().ref(url)
      .orderByChild('name', 'desc')
      .once('value', (response) => {
        let temp = [];
        response.forEach(x => {
          let category = x.toJSON();
          category.key = x.key;
          temp.push(category);
        });
        setCategories(temp)
      }, (error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    loadData();
  }, [])

  function Item({ title }) {
    return (
      <View style={{
        width: '100%',
        borderColor: 'red', 
        borderWidth:2, 
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
      }}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  const addWord = () => {
    Alert.prompt(
      "Category name",
      "",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: name => {
            let data = {
              name
            }
            firebase.database().ref(url).push(data).then(() => {
              loadData();
            }).catch(e => {
              console.log('error saveing category: ', e);
            })
          }
        }
      ]
    );
  }

  return (
    <View>
      <Button
        title="Add"
        onPress={() => addWord()}
      />
      {
        categories.length > 0 && <SafeAreaView style={styles.container}>
          <FlatList
            data={categories}
            renderItem={({ item }) => <Item title={item.name} />}
            keyExtractor={item => item.key}
          />
        </SafeAreaView>
      }
    </View>
  )
}


const styles = StyleSheet.create({

});

export default CategoriesScreen
