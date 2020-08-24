import {COLORS} from '../colors.js';
import React, {useState, useEffect} from 'react';
import AppButton from './AppButton.js';
import Header from './Header';
import Hr from 'react-native-hr-component';
import {signUp, signIn} from '../functions.js';
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
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '564449950849-1g9n892jm9q4mu9tigs18f38jbgdqgso.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      //hostedDomain: '', // specifies a hosted domain restriction
      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      //accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

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
             <GoogleSigninButton
    style={{ width: 192, height: 48 }}
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
               onPress={() => { console.warn("clickos") }}/>
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
