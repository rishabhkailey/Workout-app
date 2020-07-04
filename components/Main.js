import React, { Component } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()

import Workout from './Workout';
import WorkoutList from './WorkoutList'
import addWorkout from './addWorkout'

const navigatorStyling = {
    headerStyle: {
        backgroundColor: 'black',
    },
    headerTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
    }
}

class Main extends Component {
    render() {
        return <NavigationContainer style={{ backgroundColor: "black" }}>
            <Stack.Navigator screenOptions={navigatorStyling}>
                <Stack.Screen name='workoutList' component={WorkoutList} options={{ title: 'All Workouts' }} />
                <Stack.Screen name='workout' component={Workout} options={({ route }) => ({ title: route.params.workout.workoutName })} />
                <Stack.Screen name='addWorkout' component={addWorkout} options={{ title: 'New Workout', }} />
            </Stack.Navigator>
        </NavigationContainer>
    }
}

export default Main