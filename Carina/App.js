import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import CarinaBar from './components/CarinaBar';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  const loginUpdater = (aName, aEmail, aId) => {
    setLoggedIn(true);
    setName(aName);
    setUserId(aId);
  };

  return (
    <View style={styles.container}>
      {!loggedIn && <LoginScreen parentUpdater={loginUpdater} />}
      {loggedIn && <Header title={name + "'s Carina"} />}
      {loggedIn && <CarinaBar user_id={userId}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
