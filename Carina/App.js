import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <View style={styles.container}>
      {loggedIn && <Header />}
      {!loggedIn && <LoginScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
