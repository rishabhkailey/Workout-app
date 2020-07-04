import React, { useState, useEffect, Component } from 'react'
import { StyleSheet, Alert, Text, View, Button, TextInput, Modal, TouchableOpacity, Animated } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import SwipeDeleteEdit from './swipeDeleteEdit'
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
        color: 'white',
    },
    body: {
        height: '100%',
        backgroundColor: '#1f1f1f',
        flex: 1
    },
    textInputContainer: {
        ...itemStyle,
        height: 55
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
        ...itemStyle,
        height: 55
        // flex: 1,
    },
    restBetweenSets: {
        ...itemStyle,
        height: 55
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
        marginTop: 0,
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
    if (input) {
        style = 'timeInput'
    }

    return <Text style={styles[style]}>{displayTime}</Text>
}

function AddTask({ visible, onSubmitFxn, edit, task }) {

    useEffect(() => {
        if (edit && firstTime) {
            setName(task.name)
            setTime(task.time)
            setFirstTime(false)// as component did mount
        }
    })

    const [name, setName] = useState('')
    const [time, setTime] = useState(defaultTime)
    const [showTime, setShowTime] = useState(false)
    const [firstTime, setFirstTime] = useState(true)

    const clearState = () => {
        setName('')
        setTime(defaultTime)
        setShowTime(false)
        setFirstTime(true)
    }

    return <Modal visible={visible}>
        <View style={styles.body}>
            <View style={styles.textInputContainer}>
                <TextInput style={styles.textInput} placeholder='Task Name' placeholderTextColor={inputColor} name='exerciseName' value={name} onChangeText={(value) => { setName(value) }} />
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
        this.animate_flaggedWorkoutName = new Animated.Value(0)
        this.animate_flaggedExercises = new Animated.Value(0)
        this.animate_flaggedNumberOfSets = new Animated.Value(0)
        this.animate_flaggedRestBetweenSets = new Animated.Value(0)
        this.animate_flagged_input = new Animated.Value(0)
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
            modalVisible: false,
            taskCount: 0,
            flaggedInputs: { workoutName: false, exercises: false, numberOfSets: false, restBetweenSets: false }
        }
        this.onTimeChange = this.onTimeChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.addTask = this.addTask.bind(this)
        this.addWorkoutRoutine = this.addWorkoutRoutine.bind(this)
        this.validateInput = this.validateInput.bind(this)
    }

    onTimeChange(event, selectedTime, name) {
        if (!selectedTime)
            selectedTime = defaultTime
        let showName = 'show' + name.substr(0, 1).toLocaleUpperCase() + name.substr(1)

        this.setState({ [name]: selectedTime, [showName]: false })
    }

    addTask(task) {
        if (task.name === '' && task.time === defaultTime) {
            this.setState({ modalVisible: false })
            return
        }
        let { exercises, taskCount, taskEdit } = this.state
        if (taskEdit) {
            this.editExercise(task)
            return
        }
        task.id = taskCount
        taskCount++
        exercises.push(task)
        this.setState({ exercises, modalVisible: false, taskCount })

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

    validateInput() {
        let { exercises, workoutName, numberOfSets, flaggedInputs } = this.state
        let flag = false
        if (workoutName.length === 0) {
            flaggedInputs['workoutName'] = true
            flag = true
        }
        if (exercises.length === 0) {
            flaggedInputs['exercises'] = true
            flag = true
        }
        if (numberOfSets.length === 0) {
            flaggedInputs['numberOfSets'] = true
            flag = true
        }

        this.setState({ flaggedInputs })

        if (flag)
            Animated.spring(this.animate_flagged_input, {
                toValue: 2,
                bounciness: 5,
                duration: 2000
            }).start(() => { this.animate_flagged_input.setValue(0) })

        return !flag

    }

    addWorkoutRoutine() {
        if (!this.validateInput())
            return

        let { exercises, workoutName, numberOfSets, restBetweenSets } = this.state
        let workoutRoutine = { workoutName, exercises, numberOfSets, restBetweenSets }

        let { edit, workout } = this.props.route.params
        if (edit) {
            workoutRoutine.id = workout.id
        }
        this.props.route.params.addWorkout(workoutRoutine)
        this.props.navigation.goBack()
        this.editExercise = this.editExercise.bind(this)
        this.deleteExercise = this.deleteExercise.bind(this)
        this.openEditMenu = this.openEditMenu.bind(this)
    }

    componentDidMount() {
        let { edit, workout } = this.props.route.params
        if (edit) {
            workout.numberOfSets = '' + workout.numberOfSets
            this.setState(workout)
        }
    }

    openEditMenu(index) {
        let { exercises } = this.state
        this.setState({ taskEdit: true, modalVisible: true, taskToBeEdited: exercises[index] })
    }

    editExercise(task) {
        let { exercises, taskToBeEdited } = this.state
        let index = -1
        index = exercises.indexOf(taskToBeEdited)
        if (index !== -1) {
            exercises.splice(index, 1, task)
        }
        this.setState({ exercises, taskEdit: false, taskToBeEdited: null, modalVisible: false })
    }

    deleteExercise(index) {
        let { exercises } = this.state
        exercises.splice(index, 1)
        this.setState({ exercises })
    }

    render() {
        let { exercises, showRestBetweenSets, restBetweenSets, modalVisible, taskEdit, taskToBeEdited, flaggedInputs } = this.state
        let workout = exercises.map((task, index) => {
            return <SwipeDeleteEdit style={styles.listItem} editFxn={() => { this.openEditMenu(index) }} deleteFxn={(index) => { this.deleteExercise(index) }} onPress={() => { this.openEditMenu(index) }}>
                <View style={styles.listItem}>
                    <Text style={styles.text}>{task.name}</Text>
                    <ShowTime time={task.time} />
                </View>
            </SwipeDeleteEdit>
        })

        let flagged_anim = {}, flag = false, animate_style = {}
        flag = Object.values(flaggedInputs).some(x => x)

        if (flag) {
            flagged_anim.translateX = this.animate_flagged_input.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 30, 0] })
            flagged_anim.color = this.animate_flagged_input.interpolate({ inputRange: [0, 1, 2], outputRange: ['rgb(117,117,117)', 'rgb(255,0,0)', 'rgb(117,117,117)'] })
            animate_style = { transform: [{ translateX: flag ? flagged_anim.translateX : 0 }], color: flag ? flagged_anim.color : null }
        }

        return <View style={styles.body}>

            <Animated.View style={flaggedInputs.workoutName ? [styles.textInputContainer, animate_style] : [styles.textInputContainer]}>
                <TextInput style={styles.textInput} placeholder='Workout Name' placeholderTextColor={inputColor} name='workoutName' value={this.state.workoutName} onChangeText={(value) => { this.onChange('workoutName', value) }} />
            </Animated.View>
            <Animated.View style={flaggedInputs.exercises ? [styles.exercises, animate_style] : [styles.exercises]}>
                <View style={styles.exercisesTitle}>
                    <Text style={styles.text}>Exercises</Text>
                </View>
                <TouchableOpacity style={styles.addTask} onPress={() => { this.setState({ modalVisible: true }) }}>
                    <Text style={{ ...styles.text, color: '#2196f3', fontWeight: 'bold' }}>Add Exercise</Text>
                </TouchableOpacity>

                <AddTask edit={taskEdit} task={taskToBeEdited} visible={modalVisible} onSubmitFxn={this.addTask} />

            </Animated.View>

            <View>
                {workout}
            </View>

            <Animated.View style={flaggedInputs.numberOfSets ? [styles.numberOfSets, animate_style] : [styles.numberOfSets]}>
                <TextInput style={styles.textInput} keyboardType='numeric' placeholder='Number of sets' placeholderTextColor={inputColor} name='numberOfSets' value={this.state.numberOfSets} onChangeText={(value) => { this.onChange('numberOfSets', value) }} />
            </Animated.View>

            <Animated.View style={flaggedInputs.restBetweenSets ? [styles.restBetweenSets, animate_style] : [styles.restBetweenSets]}>

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

            </Animated.View>

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