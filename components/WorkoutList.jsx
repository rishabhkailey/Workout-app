import React, { Component } from 'react'
import { StyleSheet, ScrollView , Text, View, TouchableOpacity, FlatList, TouchableHighlight , Button, Modal } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196f3',
        right: 25,
        bottom: 25
    },
    addIcon: {
        color: 'blue'
    }
  });


function Item({title,onPress}) {
  return <TouchableOpacity onPress={onPress} style={styles.listItem}><Text style={styles.listName}>{title}</Text></TouchableOpacity>
}

class WorkoutList extends Component {
    constructor(props) {
        super(props)
        console.log('inside constructor', props)
        this.state = {
            workoutList: [
                {
                    id: 0,workoutName: 'evening workout',
                    exercises: [{ name: 'situps', time: new Date("October 13, 2020 00:05:00") },{ name: 'pushups', time: new Date("October 13, 2020 00:05:00") }],
                    numberOfSets: 5,
                    restBetweenSets: new Date("October 13, 2020 00:01:00")
                },
            ],
            modalVisible: false
        }
        this.addWorkout = this.addWorkout.bind(this)
    }

    addWorkout(workout) {
        let {workoutList} = this.state
        workoutList.push(workout)
        this.setState({workoutList})
    }
    
    setModalVisible(modalVisible) {
        this.setState({modalVisible})
    }
    
    navigate(path,params) {
        let { navigation } = this.props
        console.log('inside fxn', navigation)
        
            navigation.navigate(path, params)
    }
    
        render() {
        let { workoutList } = this.state
        
        return <View style={styles.list}>
            
            <FlatList data={workoutList} renderItem={({item})=><Item style={styles.listItem} keyExtractor={item => item.id} onPress={() => { this.navigate('workout',{workout: item}) }} title={item.workoutName} /> } ></FlatList>
            
            <TouchableOpacity style={styles.addButton} title='add' onPress= {()=>{this.navigate('addWorkout',{addWorkout: this.addWorkout})}} >
                {/* <FontAwesomeIcon icon={faPlus} style={styles.addIcon} size={50} /> */}
            </TouchableOpacity>

        </View>
    }
}

export default WorkoutList