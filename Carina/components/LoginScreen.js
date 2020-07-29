import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import AppButton from './AppButton.js';
import Hr from 'react-native-hr-component';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.text}> Carina </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="gray">
          {' '}
        </TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="gray">
          {' '}
        </TextInput>
        <AppButton
          title="Sign In"
          onPress={() => {
            console.log('Clicked');
          }}
        />
        <Hr
          lineColor="#eee"
          width={1}
          hrPadding={20}
          text="Sign in with"
          textStyles={{color: 'white'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.5,
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 44,
    color: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    color: 'gray',
    width: '80%',
    height: 40,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default LoginScreen;
