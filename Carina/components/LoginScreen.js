import {COLORS} from '../colors.js';
import React, {useState, useEffect} from 'react';
import AppButton from './AppButton.js';
import {
  signUp,
  signIn,
  addGoogleUser,
  getUserIdByGoogleId,
} from '../functions.js';
import {TextInput as PaperTextInput} from 'react-native-paper';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import Toast from 'react-native-simple-toast';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = (props) => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [repeatSecret, setRepeatSecret] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '564449950849-1g9n892jm9q4mu9tigs18f38jbgdqgso.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const signUpHandler = () => {
    if (name && email && secret && repeatSecret && secret === repeatSecret) {
      if (validateEmail(email)) {
        signUp(null, email, name, secret);
        setSignupSuccess(true);
      } else {
        Toast.show('Please enter a valid email');
      }
    } else if (name && email) {
      Toast.show("Passwords doesn't match");
    } else if (!name) {
      Toast.show('Please enter your name');
    } else if (!email) {
      Toast.show('Please enter your email');
    } else if (!secret) {
      Toast.show('Please enter your password');
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let user = userInfo.user;
      addGoogleUser(user.id, user.email, user.name).then(() => {
        getUserIdByGoogleId(user.id).then((res) => {
          props.signInHandler(res);
        });
      });
    } catch (error) {
      console.log({error});
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  const hr = () => {
    return <View style={{backgroundColor: 'white', width: '90%', height: 1}} />;
  };

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      //source={require('../assets/note.jpg')}>
      source={require('../assets/beach.jpg')}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {!signupOpen ? (
          <View style={styles.loginContainer}>
            <Text style={styles.title}> Carina </Text>
            <PaperTextInput
              dense={true}
              style={styles.input}
              mode="outlined"
              value={signupSuccess && email}
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
              {!signupSuccess && (
                <Text
                  style={styles.textButton}
                  onPress={() => {
                    setSignupOpen(!signupOpen);
                  }}>
                  Sign Up
                </Text>
              )}
              <Text style={styles.textButton}>Reset Password</Text>
            </View>
            <AppButton
              title="Sign In"
              onPress={() => {
                signIn(email, secret)
                  .then((res) => {
                    let result = res[0][0];
                    props.signInHandler(
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
            {hr()}
            <GoogleSigninButton
              style={{width: 120, height: 48, marginBottom: 10, marginTop: 10}}
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Light}
              onPress={googleSignIn}
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
              <View>
                <Text style={styles.infoText}>Signup Successfull!</Text>
                <Text style={styles.signupSuccessText}>
                  Welcome to Carina {name}
                </Text>
              </View>
            )}
            <View>
              {!signupSuccess ? (
                <View style={styles.displayRow}>
                  <AppButton title="Sign Up" onPress={signUpHandler} />
                  <AppButton
                    title="Abort"
                    onPress={() => {
                      setSignupOpen(false);
                      setSignupSuccess(false);
                    }}
                  />
                </View>
              ) : (
                <View style={styles.displayRow}>
                  <AppButton
                    title="Go Back"
                    onPress={() => {
                      setSignupOpen(false);
                    }}
                  />
                </View>
              )}
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
    fontFamily: 'Roboto',
  },
  input: {width: '90%', marginLeft: 5, marginBottom: 10},
  infoText: {
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Roboto',
  },
});

export default LoginScreen;
