import {COLORS} from '../colors.js';
import React, {Component, setState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Swipeable from 'react-native-swipeable-row';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Toast from 'react-native-simple-toast';
import {addTodo} from '../functions.js';
import PlanningModeButton from './PlanningModeButton';

const leftContent = <Text />;

const rightButtons = [
  <TouchableHighlight>
    <Text />
  </TouchableHighlight>,
];

const planningModeAttributes = [
  {
    title: 'Today',
    attribute: ' today ',
  },
  {
    title: 'Tomorrow',
    attribute: ' tomorrow ',
  },
];

class CarinaBar extends Component {
  state = {
    planningMode: false,
    planningModeButton: false,
    query: '',
    planningAttributes: '',
  };

  addAttribute = (attr) => {
    console.log(attr);
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.query}
          ref="textinput"
          style={styles.bar}
          placeholder="Add task to Carina"
          onFocus={() => {
            if (!this.state.planningMode) {
              this.setState({planningModeButton: true});
            }
          }}
          onBlur={() => {
            if (this.state.planningModeButton) {
              this.setState({planningMode: false});
            }
            this.setState({planningModeButton: false});
          }}
          placeholderTextColor={COLORS.mainLight}
          onSubmitEditing={(text) => {
            if (this.state.query !== '') {
              addTodo(
                this.props.userId,
                this.state.planningMode
                  ? this.state.query + ' ' + this.state.planningAttributes
                  : this.state.query,
                this.props.listId,
                this.props.token,
              ).then((todo) => {
                this.props.todoListUpdater();
                if (this.state.planningMode) {
                  this.refs.textinput.focus();
                }
              });
              this.setState({query: ''});
            } else {
              Toast.show('A todos title cannot be empty');
            }
          }}
          onChangeText={(text) => {
            this.setState({query: text});
          }}
        />
        {this.state.planningModeButton && (
          <View style={styles.planningModContainer}>
            <Icon name="calendar-outline" size={15} color={COLORS.mainDark} />
            <Text
              style={styles.planningModeText}
              onPress={() => {
                this.setState({planningMode: true, planningModeButton: false});
              }}>
              Planning Mode
            </Text>
          </View>
        )}
        {this.state.planningMode && (
          <View>
            <Swipeable
              leftContent={leftContent}
              rightButtons={rightButtons}
              onLeftActionRelease={() => {
                this.setState({planningMode: false, planningModeButton: true});
              }}
              onRightActionRelease={() => {
                this.setState({planningMode: false, planningModeButton: true});
              }}>
              <TextInput
                style={styles.planningModeBar}
                placeholder="Enter todo attributes (swipe to close)"
                placeholderTextColor={COLORS.lightGray}
                onChangeText={(text) => {
                  this.setState({planningAttributes: text});
                }}
              />
            </Swipeable>
            <View style={{flexDirection: 'row'}}>
              {planningModeAttributes.map((elem) => {
                return (
                  <PlanningModeButton
                    title={elem.title}
                    attribute={elem.attribute}
                    onPress={this.addAttribute}
                  />
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  bar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    backgroundColor: COLORS.mainSuperLight,
    width: '100%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    fontSize: 30,
    borderColor: COLORS.mainLight,
  },
  planningModContainer: {
    marginTop: 10,
    marginLeft: 15,
    borderRadius: 3,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 3,
  },
  planningModeText: {color: COLORS.mainDark, marginLeft: 3},
  planningModeBar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    backgroundColor: COLORS.mainSuperLight,
    width: '100%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    fontSize: 16,
    borderColor: COLORS.mainLight,
  },
  text: {
    color: 'black',
    backgroundColor: 'white',
  },
  boxShadow: {
    shadowColor: COLORS.mainDark,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 13.97,

    elevation: 20,
  },
});

export default CarinaBar;
