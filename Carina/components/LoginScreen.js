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
      <Header selectedList={{id: null, title: 'Login'}} />
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.text}> Carina </Text>
          <PaperTextInput
            dense={true}
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="black"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <PaperTextInput
            dense={true}
            style={styles.input}
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
                  props.parentUpdater(result.fullname, result.email, result.id);
                })
                .catch((e) => {
                  console.error(e);
                });
            }}
          />
          <Modal visible={signupOpen}>
            <ImageBackground
              style={styles.imgBackground}
              resizeMode="cover"
              source={require('../assets/note.jpg')}>
              <Header selectedList={{id: null, title: 'Sign Up'}} />
              <View style={styles.container}>
                <View style={styles.loginContainer}>
                  <Text style={styles.text}> Join Carina </Text>
                  <PaperTextInput
                    dense={true}
                    onChangeText={(text) => {
                      setName(text);
                    }}
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="black"
                  />
                  <PaperTextInput
                    dense={true}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="black"
                  />
                  <PaperTextInput
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
              </View>
            </ImageBackground>
          </Modal>
          {/*<Hr
          lineColor="#eee"
          width={1}
          hrPadding={20}
          text="Sign in with"
          textStyles={{color: 'white'}}
        />*/}
        </View>
      </View>
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
    width: '100%',
    height: '100%',
    flex: 1,
  },
  loginContainer: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.5,
    backgroundColor: COLORS.mainLight,
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
  displayRow: {
    flexDirection: 'row',
  },
  textButton: {
    color: 'white',
    marginLeft: 20,
    marginRight: 20,
  },
  input: {width: '90%', marginLeft: 5, marginBottom: 10},
});

export default LoginScreen;
