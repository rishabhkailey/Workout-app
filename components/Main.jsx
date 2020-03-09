import React, { Component } from 'react'

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator()

import Workout from './Workout';
import WorkoutList from './WorkoutList'
import addWorkout from './addWorkout'

const navigatorStyling = {
    headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
      }
}

class Main extends Component {
    render() {
        return <NavigationContainer style={{backgroundColor: "black"}}>
                <Stack.Navigator>
                    <Stack.Screen name='workoutList' component={WorkoutList} options={{title: 'All Workouts',...navigatorStyling}} />
                    <Stack.Screen name='workout' component={Workout} options={{title: 'Workout',...navigatorStyling}} />
                    <Stack.Screen name='addWorkout' component={addWorkout} options={{title: 'New Workout',...navigatorStyling}}/>
                </Stack.Navigator>
            </NavigationContainer>
    }
}

export default Main