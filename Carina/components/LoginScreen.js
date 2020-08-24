import {COLORS} from '../colors.js';
import React, {useState} from 'react';
import AppButton from './AppButton.js';
import Header from './Header';
import Hr from 'react-native-hr-component';
import {signUp, signIn} from '../functions.js';
import {TextInput as PaperTextInput} from 'react-native-paper';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = (props) => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [repeatSecret, setRepeatSecret] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      source={require('../assets/note.jpg')}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {!signupOpen ? (
          <View style={styles.loginContainer}>
            <Text style={styles.title}> Carina </Text>
            <PaperTextInput
              dense={true}
              style={styles.input}
              mode="outlined"
              placeholder="Username"
              placeholderTextColor="black"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            <PaperTextInput
              dense={true}
              style={styles.input}
              mode="outlined"
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="black"
              onChangeText={(text) => {
                setSecret(text);
              }}
            />
            <View style={styles.displayRow}>
              <Text
                style={styles.textButton}
                onPress={() => {
                  setSignupOpen(!signupOpen);
                }}>
                Sign Up
              </Text>
              <Text style={styles.textButton}>Reset Password</Text>
            </View>
            <AppButton
              title="Sign In"
              onPress={() => {
                signIn(email, secret)
                  .then((res) => {
                    let result = res[0][0];
                    props.parentUpdater(
                      result.fullname,
                      result.email,
                      result.id,
                    );
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }}
            />
          </View>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.title}> Register </Text>
            <PaperTextInput
              mode="outlined"
              dense={true}
              onChangeText={(text) => {
                setName(text);
              }}
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="black"
            />
            <PaperTextInput
              mode="outlined"
              dense={true}
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="black"
            />
            <PaperTextInput
              mode="outlined"
              dense={true}
              secureTextEntry={true}
              onChangeText={(text) => {
                setSecret(text);
              }}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="black"
            />
            <PaperTextInput
              mode="outlined"
              dense={true}
              secureTextEntry={true}
              onChangeText={(text) => {
                setRepeatSecret(text);
              }}
              style={styles.input}
              placeholder="Repeat Password"
              placeholderTextColor="black"
            />
            {signupSuccess && (
              <Text>Signup Successfull. Welcome to Carina {name}!</Text>
            )}
            <View style={styles.displayRow}>
              <AppButton
                title="Sign Up"
                onPress={() => {
                  if (secret === repeatSecret) {
                    signUp(null, email, name, secret);
                    setSignupSuccess(true);
                  }
                }}
              />
              <AppButton
                title="Abort"
                onPress={() => {
                  setSignupOpen(false);
                  setSignupSuccess(false);
                }}
              />
            </View>
          </View>
        )}
        {/*<Hr
          lineColor="#eee"
          width={1}
          hrPadding={20}
          text="Sign in with"
          textStyles={{color: 'white'}}
        />*/}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loginContainer: {
    backgroundColor: COLORS.mainLight,
    width: windowWidth * 0.7,
    borderWidth: 0.5,
    borderColor: COLORS.mainDark,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  text: {
    fontSize: 44,
    color: 'white',
  },
  title: {
    fontSize: 50,
    fontFamily: 'sans-serif-thin',
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
  },
  displayRow: {
    flexDirection: 'row',
  },
  textButton: {
    color: 'white',
    marginLeft: 20,
    marginRight: 20,
    fontFamily: 'Helvetica',
  },
  input: {width: '90%', marginLeft: 5, marginBottom: 10},
});

export default LoginScreen;
