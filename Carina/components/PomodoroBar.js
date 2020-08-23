import {COLORS} from '../colors.js';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import moment from 'moment';
import {Button} from 'react-native-elements';
import {incPomo, getPomosToday} from '../functions';
const POMO_TIME = 10;
const POMO_PAUSE = 3;

const PomodoroBar = (props) => {
  const [pause, setPause] = useState(false);
  const [pomosToday, setPomosToday] = useState([]);
  const [pomoTime, setPomoTime] = useState(POMO_TIME);
  const [pausePressed, setPausePressed] = useState(false);

  useEffect(() => {
    getPomosToday(props.userId).then((res) => {
      setPomosToday(res);
    });
  }, [props.userId]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: pause ? COLORS.green : COLORS.red},
      ]}>
      <View style={styles.col1}>
        <View style={styles.row1}>
          <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
            {props.todo.title}
          </Text>
        </View>
        <View style={styles.row2}>
          <View style={styles.button}>
            <Icon
              name={!pausePressed ? 'pause' : 'play'}
              size={25}
              color={COLORS.mainDark}
              onPress={() => {
                setPausePressed(!pausePressed);
              }}
            />
          </View>
          <View style={styles.button}>
            <Icon
              name="stop"
              size={25}
              color={COLORS.mainDark}
              onPress={() => {
                props.updatePomoActive(null);
                setPause(false);
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.col2}>
        <CountDown
          until={pomoTime}
          onFinish={() => {
            console.log('pause: ', pause);
            setPomoTime(!pause ? POMO_TIME : POMO_PAUSE);
            setPause(!pause);
            incPomo(props.userId, props.todo.id);
          }}
          running={!pausePressed}
          onPress={() => alert('hello')}
          size={26}
          timeToShow={['M', 'S']}
          digitStyle={{backgroundColor: '#FFF'}}
          timeLabels={{m: null, s: null}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  col1: {alignItems: 'center', flex: 3},
  row1: {paddingBottom: 0},
  row2: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'white',
    width: 50,
    borderRadius: 5,
    alignItems: 'center',
  },
  col2: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PomodoroBar;
