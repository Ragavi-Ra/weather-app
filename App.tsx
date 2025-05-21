import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppMain from './AppMain';
import { TemperatureProvider } from './context/TempContext';
import { SelectedCategoriesProvider } from './context/SelectedCategoriesContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TemperatureProvider>
        <SelectedCategoriesProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="AppMain">
            <Stack.Screen
              name="AppMain"
              component={AppMain}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </SelectedCategoriesProvider>
      </TemperatureProvider>
    </GestureHandlerRootView>
  );
};

export default App;
