import {COLORS} from '../colors.js';
import {globalStyles} from '../globalstyles.js';
import React, {useState, useEffect} from 'react';
import AppButton from './AppButton.js';
import {
  signUp,
  signIn,
  addGoogleUser,
  getUserIdByGoogleId,
  beginResetPassword,
  confirmResetPassword,
  validateEmail,
} from '../functions.js';

import LinearGradient from 'react-native-linear-gradient';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [repeatSecret, setRepeatSecret] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(false);

  // For displaying visual elements
  const [signupOpen, setSignupOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '564449950849-1g9n892jm9q4mu9tigs18f38jbgdqgso.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signUpHandler = () => {
    if (
      name &&
      email &&
      secret &&
      repeatSecret &&
      secret === repeatSecret &&
      secret.length >= 8
    ) {
      if (validateEmail(email)) {
        signUp(null, email, name, secret)
          .then(() => {
            setSignupSuccess(true);
            setErrorMessage(null);
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
          });
      } else {
        Toast.show('Please enter a valid email');
      }
    } else if (name && email && secret && secret !== repeatSecret) {
      Toast.show("Passwords doesn't match");
    } else if (!name) {
      Toast.show('Please enter your name');
    } else if (!email) {
      Toast.show('Please enter your email');
    } else if (!secret) {
      Toast.show('Please enter your password');
    } else if (secret.length >= 8) {
      Toast.show('Password needs to be at least 8 characters long');
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let user = userInfo.user;
      addGoogleUser(user.id, user.email, user.name).then(() => {
        console.log('login by google');
        getUserIdByGoogleId(user.id).then((res) => {
          console.log('asså: ', res);
          let id = res.result[0].id;
          let token = res.token;
          console.log('KOMIGEN', id, token);
          props.signInHandler(id, token);
        });
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      }
    }
  };

  const hr = () => {
    return <View style={styles.hr} />;
  };

  return (
    //<ImageBackground
    //style={styles.imgBackground}
    //resizeMode="cover"
    //source={require('../assets/note.jpg')}>
    <LinearGradient
      colors={['white', COLORS.mainSuperLight]}
      start={{x: 0, y: 0.5}}
      locations={[0, 0]}
      style={styles.linearGradient}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {!signupOpen && !resetOpen ? (
          <View style={styles.loginContainer}>
            <Text style={styles.title}> Carina </Text>
            <TextInput
              value={email}
              style={styles.bar}
              placeholder="Username"
              placeholderTextColor="black"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            <TextInput
              style={styles.bar}
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
              <Text
                style={styles.textButton}
                onPress={() => {
                  setResetOpen(true);
                }}>
                Reset Password
              </Text>
            </View>
            <AppButton
              title="Sign In"
              wide={true}
              onPress={() => {
                signIn(email.trim(), secret)
                  .then((res) => {
                    let userInfo = res.userInfo[0][0];
                    let token = res.token;
                    props.signInHandler(userInfo.id, token);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }}
            />
            {hr()}
            <GoogleSigninButton
              style={styles.googleButton}
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Light}
              onPress={googleSignIn}
            />
          </View>
        ) : null}
        {signupOpen && !resetOpen ? (
          <View style={styles.loginContainer}>
            <Text style={styles.title}> Register </Text>
            <TextInput
              onChangeText={(text) => {
                setName(text);
              }}
              style={styles.bar}
              placeholder="Name"
              placeholderTextColor="black"
            />
            <TextInput
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={styles.bar}
              placeholder="Email"
              placeholderTextColor="black"
            />
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => {
                setSecret(text);
              }}
              style={styles.bar}
              placeholder="Password"
              placeholderTextColor="black"
            />
            <TextInput
              mode="outlined"
              dense={true}
              secureTextEntry={true}
              onChangeText={(text) => {
                setRepeatSecret(text);
              }}
              style={styles.bar}
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
            {errorMessage && (
              <Text style={globalStyles.errorMessage}>{errorMessage}</Text>
            )}
            <View>
              {!signupSuccess ? (
                <View style={styles.displayRow}>
                  <AppButton title="Sign Up" onPress={signUpHandler} />
                  <AppButton
                    bgColor={COLORS.red}
                    textColor="white"
                    title="Cancel"
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
        ) : null}
        {resetOpen ? (
          <View style={styles.loginContainer}>
            <Text style={styles.titleSmaller}> Reset Password </Text>
            {!confirmationSent ? (
              <View style={styles.fullWidthAlignCenter}>
                <Text style={styles.infoText}>
                  A confirmation code will be sent{'\n'} to your email
                </Text>
                <TextInput
                  value={email}
                  style={styles.bar}
                  placeholder="Email"
                  placeholderTextColor="black"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
                <View style={styles.displayRow}>
                  <AppButton
                    title="Send Code"
                    onPress={() => {
                      setConfirmationSent(true);
                      beginResetPassword(email);
                    }}
                  />
                  <AppButton
                    title="Cancel"
                    bgColor={COLORS.red}
                    textColor={'white'}
                    onPress={() => {
                      setResetOpen(false);
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.fullWidthAlignCenter}>
                <Text style={styles.infoText}>
                  Enter the confirmation code sent to you by email
                </Text>
                <TextInput
                  value={confirmationCode}
                  style={styles.bar}
                  placeholder="Confirmation Code"
                  placeholderTextColor="black"
                  onChangeText={(text) => {
                    setConfirmationCode(text);
                  }}
                />
                <Text style={styles.infoText}>Choose a new password</Text>
                <TextInput
                  value={secret}
                  style={styles.bar}
                  placeholder="New Password"
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    setSecret(text);
                  }}
                />
                <TextInput
                  value={repeatSecret}
                  style={styles.bar}
                  placeholder="Repeat New Password"
                  placeholderTextColor="black"
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    setRepeatSecret(text);
                  }}
                />
                <View style={styles.displayRow}>
                  <AppButton
                    title="Change Password"
                    onPress={() => {
                      if (
                        repeatSecret === secret &&
                        repeatSecret &&
                        secret &&
                        confirmationCode
                      ) {
                        if (secret.length >= 8) {
                          setConfirmationSent(true);
                          confirmResetPassword(
                            email,
                            secret,
                            confirmationCode,
                          ).then(() => {
                            setResetOpen(false);
                            setConfirmationSent(false);
                          });
                        } else {
                          Toast.show(
                            'Password needs to be at least 8 characters long',
                          );
                        }
                      } else {
                        Toast.show(
                          'Some field is empty or the passwords do not match',
                        );
                      }
                    }}
                  />
                  <AppButton
                    title="Cancel"
                    bgColor={COLORS.red}
                    textColor="white"
                    onPress={() => {
                      setResetOpen(false);
                      setConfirmationSent(false);
                      setSecret('');
                      setRepeatSecret('');
                      setConfirmationCode('');
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </LinearGradient>
    //</ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    width: windowWidth,
    height: windowHeight,
  },
  imgBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: windowWidth,
    height: windowHeight,
  },
  loginContainer: {
    backgroundColor: COLORS.mainLight,
    width: windowWidth < 400 ? windowWidth * 0.7 : 300,
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
  titleSmaller: {
    fontSize: 30,
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
  bar: {
    alignSelf: 'center',
    color: COLORS.mainDark,
    marginBottom: 10,
    backgroundColor: COLORS.mainSuperLight,
    height: 40,
    width: '90%',
    paddingLeft: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.mainLight,
    borderTopWidth: 0.2,
    borderTopColor: COLORS.mainLight,
    fontSize: 14,
    borderColor: COLORS.mainLight,
  },
  hr: {
    backgroundColor: 'white',
    width: '90%',
    height: 1,
  },
  googleButton: {
    width: 120,
    height: 48,
    marginBottom: 10,
    marginTop: 10,
  },
  fullWidthAlignCenter: {
width: '100%', alignItems: 'center'
  }
});

export default LoginScreen;
