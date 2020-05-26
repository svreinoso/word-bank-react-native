import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';
import Modal from "react-native-modal";
import RadioForm, { } from 'react-native-simple-radio-button';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordsList: [],
      filteredWordsList: [],
      progress: 0,
      indeterminate: true,
      isDataLoaded: false,
      isModalVisible: false,
      isStatusModalVisible: false,
      selectedStatusFilter: 0,

    }
    this.props.navigation.addListener('focus', (x) => { 
      if (!firebase.auth().currentUser) {
        this.props.navigation.navigate('Login')
        return;
      }
      this.loadData(); 
    })
  }

  loadData() {
    const url = `users/${firebase.auth().currentUser.uid}/words/`;
    firebase.database().ref(url)
      .orderByChild('createdDate', 'desc')
      .once('value', (response) => {
        let words = [];
        response.forEach(x => {
          let word = x.toJSON();
          word.key = x.key;
          words.push(word);
        });
        words.sort((a,b) => {
          return a.createdDate < b.createdDate ? 1 : -1;
        });
        this.setState({ wordsList: words, filteredWordsList: words, isDataLoaded: true });
      }, (error) => {
        console.error(error);
      });
  }

  updateHeaderBar() {
    this.props.navigation.setOptions(
      {
        title: 'Home',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerRight: () => (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
            <View style={{ marginRight: 20, marginTop: 5 }}>
              <Icon color="#fff" name="plus-circle" size={24}
                onPress={() => this.props.navigation.navigate('EditWord', { callback: this.loadData })} />
            </View>
            <View style={{ marginRight: 20, marginTop: 5 }}>
              <Menu>
                <MenuTrigger >
                  <Icon color="#fff" name="filter" size={24} />
                </MenuTrigger>
                <MenuOptions customStyles={{backgroundColor: 'red'}}>
                  <MenuOption onSelect={() => this._filterByStatus(1)} text='By Added' />
                  <MenuOption onSelect={() => this._filterByStatus(2)} text='By Learning' />
                  <MenuOption onSelect={() => this._filterByStatus(3)} text='By Learned' />
                  <MenuOption onSelect={() => this._filterByStatus(4)} text='Show All' />
                  <MenuOption onSelect={() => this._filterByTotay()} text='Added today' />
                  <MenuOption onSelect={() => this._filterByDateRange()} text='By Date Range' />
                </MenuOptions>
              </Menu>
            </View>
            <View style={{ marginRight: 10, marginTop: 5 }}>
              <Icon color="#fff" name="user" size={24} onPress={() => this.props.navigation.navigate('User')} />
            </View>
          </View>
        )
      }
    )

  }

  componentDidMount() {
    this.updateHeaderBar()
    if (!firebase.auth().currentUser) {
      this.props.navigation.navigate('Login')
      return;
    }
    this.loadData();
  }

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  deleteRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const newData = [...this.state.listViewData];
    const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    this.setState({ listViewData: newData });
  }

  getStatus = (status) => {
    switch (status) {
      case 2:
      case "2":
        return 'Learning';
      case 3:
      case "3":
        return 'Learned';
      default:
        return 'Added';
    }
  };

  getColorStatus = (status) => {
    switch (status) {
      case 2:
      case "2":
        return { color: '#f48404', fontWeight: "bold" };
      case 3:
      case "3":
        return { color: '#19AF05', fontWeight: "bold" };
      default:
        return { color: '#F5293E', fontWeight: "bold" };
    }
  };

  deleteWord(rowMap, rowKey) {
    const url = `users/${firebase.auth().currentUser.uid}/words/`;
    firebase.database().ref(url + rowKey).remove(() => {
      const index = this.state.wordsList.findIndex(value => value.key === rowKey);
      const words = this.state.wordsList;
      words.splice(index, 1);
      this.setState({wordsList: words})
    }).then(x => {}).catch(e => {})
  }

  editWord(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const word = this.state.wordsList.find(value => value.key === rowKey);
    this.props.navigation.navigate('EditWord', {
      word: word,
      callback: this.loadData
    });
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress });
      }, 500);
    }, 1500);
  }

  showProgressBar() {
    if (!this.state.isDataLoaded) {
      return (
        < View style={{ justifyContent: 'center', alignItems: 'center', }} >
          <Progress.Bar
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
        </View>
      );
    }
  }

  _filterByTotay = () => {
    let startDate = new Date();
    startDate.setHours(0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59);

    let words = this.state.wordsList;

    let filteredWords = words.filter((value) => 
      value.createdDate > startDate.getTime() && value.createdDate < endDate.getTime());
    this.setState({ filteredWordsList: filteredWords });
  }

  _filterByStatus = (status) => {
    let words = this.state.wordsList;
    if (status === 4) {
      this.setState({ filteredWordsList: words });
      return;
    }
    let filteredWords = words.filter((value) => value.status == status);
    this.setState({ filteredWordsList: filteredWords });
  }

  _filterByDateRange = () => {

  }

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  _showFilterStatusModal = () => {
    this.setState({ isModalVisible: false, isStatusModalVisible: true });
  }
  _closeModal = () => {
    this.setState({
      isModalVisible: false,
      isStatusModalVisible: false
    });
  }

  render() {
    if (!firebase.auth().currentUser) {
      this.props.navigation.navigate('Login');
    }

    var radio_props = [
      { label: 'Added', value: 1 },
      { label: 'Learning', value: 2 },
      { label: 'Learned', value: 3 }
    ];

    return (
      <View style={styles.container}>
        {this.showProgressBar()}
        {this.state.wordsList.length > 0 &&
          <SwipeListView
            useFlatList
            data={
              this.state.filteredWordsList
            }
            renderItem={(data) => (
              <View style={styles.rowFront}>
                <View style={styles.wordContainer}>
                  <Text style={styles.word}>{data.item.word}</Text>
                  <Text>{data.item.translate}</Text>
                </View>
                <View style={styles.wordInfoContainer}>
                  <Text>{moment(data.item.createdDate).format('DD-MMM-YYYY')}</Text>
                  <Text style={this.getColorStatus(data.item.status)}>{this.getStatus(data.item.status)}</Text>
                </View>
              </View>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft, {
                  width: 75, right: 75, backgroundColor: 'red'
                }]}
                  onPress={_ => this.deleteWord(rowMap, data.item.key)}>
                  <View style={styles.rightOptions}>
                    <Icon name='trash' color='#fff' size={24} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}
                  onPress={_ => this.editWord(rowMap, data.item.key)}>
                  <View style={styles.rightOptions}>
                    <Icon name='edit' color='#fff' size={24}/>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-150}
            leftOpenValue={0}
          />
        }
        <Modal onBackdropPress={() => this.setState({ isModalVisible: false })}
          isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1, backgroundColor: 'white', position: "relative", alignItems: 'center' }}>
            <TouchableOpacity onPress={this._toggleModal} style={{ position: "absolute", top: 0, right: 0 }}>
              <Icon color="red" name="plus-circle" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 25, marginBottom: 25, paddingBottom: 25 }}>Filters</Text>
              <TouchableOpacity style={styles.filterButtons} onPress={this._showFilterStatusModal}>
                <Button style={styles.filterButtons} title="By status" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButtons}>
                <Button style={styles.filterButtons} title="By date" onPress={() => this.logout()} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButtons}>
                <Button title="Search" onPress={() => this.logout()} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isStatusModalVisible}>
          <View style={{ flex: 1, backgroundColor: 'white', position: "relative", alignItems: 'center' }}>
            <TouchableOpacity onPress={this._closeModal}
              style={{ position: "absolute", top: 0, right: 0 }}>
              <Icon color="red" name="plus-circle" size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 25, marginBottom: 25, paddingBottom: 25 }}>Filters</Text>
              <View>
                <RadioForm
                  radio_props={radio_props}
                  initial={0}
                  onPress={(value) => { this.setState({ selectedStatusFilter: value }) }}
                />
              </View>
              <TouchableOpacity style={styles.filterButtons}>
                <Button title="Accept" onPress={() => this.logout()} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );

  }
}

const styles = StyleSheet.create({
  filterButtons: { marginBottom: 50 },
  rightOptions: { 
    justifyContent: 'center',
    alignContent: 'center'
  },
  item: {
    padding: 10, fontSize: 18, height: 80, borderWidth: 2, borderColor: 'gray', borderStyle: 'solid',
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', margin: 2
  },
  word: { fontSize: 25, fontWeight: 'bold', color: 'black' },
  wordContainer: {
    paddingLeft: 10, width: '50%', color: 'black', alignItems: 'stretch', alignContent: 'flex-start',
    fontWeight: 'bold'
  },
  wordInfoContainer: {
    paddingRight: 10, paddingTop: 10, width: '50%', textAlign: 'right', alignContent: 'flex-end',
    alignItems: 'flex-end'
  },
  container: { backgroundColor: 'white', flex: 1 },
  standalone: { marginTop: 30, marginBottom: 30, },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    flexDirection: 'row',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    height: 60,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 0
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 4,
  },
  trash: {
    height: 25,
    width: 25,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default HomeScreen;
