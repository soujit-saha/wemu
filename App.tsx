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

function App() {

  return (
    <StripeProvider publishableKey="pk_test_51S12yjEU85asLDm2Je4dFVLjmClhYhvAuiDA1JifRmeDQTMcJt95kVycFEV4u5qFp54NYxiHXCj4mhUh9UlFhK5p00OXoQE9Sz">
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
