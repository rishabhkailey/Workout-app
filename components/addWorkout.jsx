import React, { useState, Component } from 'react'
import { StyleSheet, Alert, Text, View, Button, TextInput, Modal, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// color of input #757575 used for color of text of custom input tags (e.g. time picker)
const inputColor = '#757575'

// 00:00:00 time
const defaultTime = new Date("October 13, 2020 00:00:00")

const itemStyle = {
    backgroundColor: 'black',
    marginHorizontal: 5,
    marginTop: 5,
    height: 50
}

const styles = StyleSheet.create({
    listItem: {
        ...itemStyle,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textInput: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        color: 'white'
    },
    body: {
        height: '100%',
        backgroundColor: '#1f1f1f'
    },
    textInputContainer: {
        ...itemStyle
        // flex: 1
    },
    exercises: {
        // flex: 1,
        ...itemStyle,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "black"
    },
    exercisesTitle: {
        flex: 1,
        // alignSelf: "flex-start"
    },
    addTask: {
        flex: 1,
        flexDirection: "row-reverse"
        // alignSelf: "flex-end"
    },
    numberOfSets: {
        ...itemStyle
        // flex: 1,
    },
    restBetweenSets: {
        ...itemStyle
        // flex: 1,
    },
    addWorkout: {
        ...itemStyle,
        // flex: 1,
        // alignItems: "flex-end",
        position: "absolute",
        bottom: 0,
        width: '100%',
    },
    text: {
        color: 'white',
        fontSize: 18,
        marginTop: 10
    },
    timeShow: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10
    },
    timeInput: {
        color: inputColor,
        fontSize: 18,
        textAlign: 'center',
    },
    timeInputLabel: {
        color: inputColor,
        fontSize: 10,
        textAlign: 'center'
    },
    timeInputContainer: {
        ...itemStyle,
        flexDirection: 'column'
    }
})

function ShowTime({ time, input }) {
    if (!time)
        return "00:00"
    let displayTime = ""
    let hrs = time.getHours()
    let min = time.getMinutes()

    if (hrs > 9) {
        displayTime += (hrs + ":")
    }
    else {
        displayTime += ("0" + hrs + ":")
    }

    if (min > 9) {
        displayTime += min
    }
    else {
        displayTime += ("0" + min)
    }

    let style = 'timeShow'
    if(input) {
        style = 'timeInput'
    }

    return <Text style={styles[style]}>{displayTime}</Text>
}

function AddTask({ visible, onSubmitFxn, exercise }) {

    let edit = true

    if (!exercise) {
        exercise = { name: '', time: defaultTime }
        edit = false
    }

    const [name, setName] = useState(exercise.name)
    const [time, setTime] = useState(exercise.time)
    const [showTime, setShowTime] = useState(false)

    const clearState = () => {
        setName('')
        setTime(defaultTime)
        edit = true
        setShowTime(false)
    }

    return <Modal visible={visible}>
        <View style={styles.body}>
            <View style={styles.textInputContainer}>
                <TextInput style={styles.textInput} placeholder='Task Name' name='exerciseName' value={name} onChangeText={(value) => { setName(value) }} />
            </View>

            <TouchableOpacity onPress={() => { setShowTime(true) }}>
                <View style={styles.timeInputContainer}>
                    <Text style={styles.timeInputLabel}>duration</Text>
                    <ShowTime time={time} input={true} />
                </View>
            </TouchableOpacity>

            {showTime && <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={time}
                mode='time'
                name='exerciseTime'
                is24Hour={true}
                display="spinner"
                onChange={(e, t) => { setShowTime(false); t ? setTime(t) : null }}
            />}

            <View style={styles.addWorkout} >
                <Button style={styles.addWorkout} title='add task' onPress={() => { onSubmitFxn({ name, time }, edit), clearState() }} />
            </View>

        </View>
    </Modal>

}

class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workoutName: '',
            exerciseName: '',
            min: '',
            sec: '',
            exercises: [],
            numberOfSets: '',
            restMinute: '',
            restSec: '',
            showTaskInput: 'none',
            exerciseTime: defaultTime,
            showExerciseTime: false,
            restBetweenSets: defaultTime,
            showRestBetweenSets: false,
            modalVisible: false
        }
        this.onTimeChange = this.onTimeChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.addTask = this.addTask.bind(this)
        this.addWorkoutRoutine = this.addWorkoutRoutine.bind(this)
    }

    onTimeChange(event, selectedTime, name) {
        if (!selectedTime)
            selectedTime = defaultTime
        let showName = 'show' + name.substr(0, 1).toLocaleUpperCase() + name.substr(1)

        this.setState({ [name]: selectedTime, [showName]: false })
    }

    addTask(task, edit) {
        if (task.name === '' && task.time === defaultTime) {
            this.setState({ modalVisible: false })
            return
        }
        let { exercises } = this.state
        if (!edit) {
            exercises.push(task)
            this.setState({ exercises, modalVisible: false })
        }
    }

    onChange(name, value) {
        if (name === 'numberOfSets') {
            value = parseInt(value)
            if (isNaN(value)) {
                console.log("nan")
                value = ''
            }
        }
        this.setState({ [name]: value })
    }

    addWorkoutRoutine() {
        let { exercises, workoutName, numberOfSets, restBetweenSets } = this.state
        let workoutRoutine = { workoutName, exercises, numberOfSets, restBetweenSets }
        console.log(workoutRoutine)
        this.props.route.params.addWorkout(workoutRoutine)
        this.props.navigation.goBack()
    }

    render() {
        let { exercises, showRestBetweenSets, restBetweenSets, modalVisible } = this.state
        let workout = exercises.map((task) => {
            return <View style={styles.listItem}>
                <Text style={styles.text}>{task.name}</Text>
                <ShowTime time={task.time} />
            </View>
        })
        return <View style={styles.body}>

            <View style={styles.textInputContainer}>
                <TextInput style={styles.textInput} placeholder='Workout Name' name='workoutName' onChangeText={(value) => { this.onChange('workoutName', value) }} />
            </View>
            <View style={styles.exercises}>
                <View style={styles.exercisesTitle}>
                    <Text style={styles.text}>Exercises</Text>
                </View>
                <TouchableOpacity style={styles.addTask} onPress={() => { this.setState({ modalVisible: true }) }}>
                    <Text style={{ ...styles.text, color: '#2196f3', fontWeight: 'bold' }}>Add Task</Text>
                </TouchableOpacity>

                <AddTask visible={modalVisible} onSubmitFxn={this.addTask} />

            </View>

            <View>
                {workout}
            </View>

            <View style={styles.numberOfSets}>
                <TextInput style={styles.textInput} placeholder='Number of sets' name='numberOfSets' value={this.state.numberOfSets} onChangeText={(value) => { this.onChange('numberOfSets', value) }} />
            </View>

            <View style={styles.restBetweenSets}>

                <TouchableOpacity onPress={() => { this.setState({ showRestBetweenSets: true }) }}>
                    <View style={styles.timeInputContainer} >
                        <Text style={styles.timeInputLabel}>
                            Rest Between Sets
                        </Text>
                        <ShowTime time={restBetweenSets} input={true} />                        
                    </View>
                </TouchableOpacity>

                {showRestBetweenSets && <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    placeholder={showRestBetweenSets}
                    value={restBetweenSets}
                    mode='time'
                    name='restBetweenSets'
                    is24Hour={true}
                    display="spinner"
                    onChange={(e, t) => { this.onTimeChange(e, t, 'restBetweenSets') }}
                />}

            </View>

            {/* <TouchableOpacity style={styles.addWorkout} onPress={this.addWorkoutRoutine}>
                <Text>Add Workout</Text>
            </TouchableOpacity> */}

            <View style={styles.addWorkout}>
                <Button title='Add Workout' onPress={this.addWorkoutRoutine} />
            </View>
        </View>
    }
}

export default Add