/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import StackNav from './src/navigators/StackNav';
import Offline from './src/screens/main/Offline';

function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StackNav />
      <Offline />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
