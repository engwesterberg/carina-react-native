import {COLORS} from '../colors.js';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CountDown from 'react-native-countdown-component';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import moment from 'moment';
import {Button} from 'react-native-elements';
import {incPomo, getPomosToday} from '../functions';
const POMO_TIME = 1500;
const POMO_PAUSE = 300;

const PomodoroBar = (props) => {
  const [pause, setPause] = useState(false);
  const [pomosToday, setPomosToday] = useState([]);

  useEffect(() => {
    getPomosToday(props.userId).then((res) => {
      setPomosToday(res);
    });
  }, [props.userId]);

  return (
    <View style={styles.container}>
      <View style={styles.col1}>
        <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
          {props.todo.title}
        </Text>
        <CountDown
          until={pause ? POMO_PAUSE : POMO_TIME}
          onFinish={() => {
            setPause(!pause);
            incPomo(props.userId, props.todo.id);
          }}
          size={20}
          timeToShow={['M', 'S']}
          digitStyle={{backgroundColor: '#FFF'}}
          timeLabels={{m: null, s: null}}
        />
      </View>
      <View style={styles.col2}>
        <Button
          icon={<Icon name="stop" size={30} color={COLORS.red} />}
          buttonStyle={{
            backgroundColor: 'white',
            height: 35,
            marginLeft: 5,
          }}
          onPress={() => {
            props.updatePomoActive(null);
            setPause(false);
          }}
        />
      </View>
      <View style={styles.col3}>
        <Text style={styles.text}>
          Total today: {pomosToday.length}({pomosToday.length / 2} hours)
        </Text>
        <ScrollView>
          {pomosToday.map((item) => {
            return (
              <Text>
                {item.task}
                {moment(item.completed).hour()}:
                {moment(item.completed).minute()}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: COLORS.mainLight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  col1: {alignItems: 'center', width: 150},
  text: {
    marginBottom: 5,
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
  },
  col2: {alignItems: 'center', justifyContent: 'center'},
  col3: {flex: 1},
});

export default PomodoroBar;
