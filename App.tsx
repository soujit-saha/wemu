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
import { StripeProvider } from '@stripe/stripe-react-native';
import StackNav from './src/navigators/StackNav';
import Offline from './src/screens/main/Offline';
import { constants } from './src/utils/constants';

function App() {

  return (
    <StripeProvider publishableKey={constants.StripeKey}>
      <SafeAreaView style={styles.container}>
        <StackNav />
        <Offline />
      </SafeAreaView>
    </StripeProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
