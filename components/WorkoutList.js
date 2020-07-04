import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, FlatList, TouchableHighlight, Button, Modal } from 'react-native'
import SwipeDeleteEdit from './swipeDeleteEdit'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import AsyncStorage from '@react-native-community/async-storage';
console.log(AsyncStorage)

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        height: 100,
        backgroundColor: 'black',
        marginHorizontal: 5,
        marginTop: 5
    },
    listName: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '500',
        flex: 1,
        marginTop: 30
    },
    list: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: "#1f1f1f",
        height: '100%'
    },
    addButton: {
        position: "absolute",
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'black',
        right: 32,
        bottom: 32,
        borderWidth: 4,
        borderColor: '#1f1f1f',
        justifyContent: 'center',
    },
    addIcon: {
        color: 'white',
        alignSelf: 'center'
    }
});


function Item({ title, onPress, deleteFxn, openEditMenu }) {
    return <SwipeDeleteEdit style={styles.listItem} onPress={onPress} deleteFxn={deleteFxn} editFxn={openEditMenu}>
        <View style={styles.listItem}>
            <Text style={styles.listName}>{title}</Text>
        </View>
    </SwipeDeleteEdit>
}

class WorkoutList extends Component {
    constructor(props) {
        super(props)
        console.log('inside constructor', props)
        this.state = {
            workoutList: [
                // {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // }, {
                //     workoutName: 'a'
                // },
            ],
            count: 1,
            modalVisible: false
        }
        this.addWorkout = this.addWorkout.bind(this)
        this.editWorkout = this.editWorkout.bind(this)
    }

    componentDidMount() {
        console.log('inside componentdidmount \n\n')
        AsyncStorage.getItem('@workout_list')
            .then((data) => {
                if (data && data !== null && data !== undefined)
                    this.setState({ workoutList: JSON.parse(data) })
            })
    }

    editWorkout(updatedWorkout) {
        let { workoutList } = this.state
        let index = -1
        workoutList.forEach((workout, index1) => {
            if (workout.id === updatedWorkout.id) {
                index = index1
            }
        })
        if (index !== -1)
            workoutList.splice(index, 1, updatedWorkout)
        this.setWorkout(workoutList)
        this.setState(workoutList)
    }

    formatStringObject(obj) {
        obj.restBetweenSets = new Date(obj.restBetweenSets)
        obj.exercises.forEach((exc) => {
            exc.time = new Date(exc.time)
        })
        return obj
    }

    setWorkout(workoutList) {
        AsyncStorage.setItem('@workout_list', JSON.stringify(workoutList))
            .then((data) => {
                console.log('stored')
            })
    }

    deleteWorkout(item) {
        let { workoutList } = this.state
        let index = workoutList.indexOf(item)
        if (index !== -1)
            workoutList.splice(index, 1)
        this.setWorkout(workoutList)
        this.setState({ workoutList })
    }

    addWorkout(workout) {
        let { workoutList, count } = this.state
        workout.id = count
        count++
        workoutList.push(workout)
        this.setWorkout(workoutList)
        this.setState({ workoutList, count })
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible })
    }

    navigate(path, params) {
        let { navigation } = this.props
        console.log('inside fxn', navigation)
        navigation.navigate(path, params)
    }

    render() {
        AsyncStorage.getItem('@workout_list')
            .then((data) => {
                console.log(JSON.parse(data))
            })
        let { workoutList } = this.state

        return <View style={styles.list}>

            <FlatList data={workoutList} renderItem={({ item }) => <Item style={styles.listItem} keyExtractor={item => item.id} openEditMenu={() => { this.navigate('addWorkout', { workout: this.formatStringObject(item), edit: true, addWorkout: this.editWorkout }) }} deleteFxn={() => { this.deleteWorkout(item) }} onPress={() => { this.navigate('workout', { workout: this.formatStringObject(item) }) }} title={item.workoutName} />} ></FlatList>
            <TouchableOpacity style={styles.addButton} title='add' onPress={() => { this.navigate('addWorkout', { addWorkout: this.addWorkout }) }} >
                <FontAwesomeIcon style={styles.addIcon} icon={faPlus} size={20} />
                {/* <FontAwesomeIcon icon={faPlus} style={styles.addIcon} size={50} /> */}
            </TouchableOpacity>
        </View>
    }
}

export default WorkoutList