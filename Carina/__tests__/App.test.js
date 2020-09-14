import {react} from 'react';
import {render} from '@testing-library/react-native';
import {App} from '../App.js';

test('render app component properly', () => {
  const {debug} = <Home />;
  debug();
});
