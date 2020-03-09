import React, { Component } from 'react'
import { StyleSheet, ScrollView ,TouchableOpacity , Text, View, Button } from 'react-native'

var interval = null, rest_interval = null

const styles = StyleSheet.create({
    startButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 25,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196f3'
    },
    resetButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 25,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196f3'
    },
    container: {
        backgroundColor: 'black',
        justifyContent: 'center',
        flexDirection: "column",
        alignItems: 'stretch',
        flex: 1
    },
    activeItem: {
        padding: 20,
        flex: 1,
        backgroundColor: '#1f1f1f',
    },
    completeItem: {
        padding: 10,
        flex: 1,
        backgroundColor: 'black',
    },
    upcomingItem: {
        padding: 10,
        flex: 1,
        backgroundColor: 'black',
    },
    count: {
        height: 50,
        backgroundColor: 'black',
        marginTop: 15,
        color: 'white',
        fontSize: 25,
        fontWeight: "500",
        textAlign: 'center'
    },
    exerciseName: {
        color: 'grey',
        fontSize: 10,
        fontWeight: '400',
        textAlign: 'center'
    },
    remainingTime: {
        color: 'white',
        fontSize: 50,
        fontWeight: "500",
        textAlign: 'center'
    }
})

class Workout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            routine: {
                exercise: [],
                numberOfSets: 0
            },
            active: 0,
            complete: false,
            set_count: 1,
            isRestTime: false,
            isRunnig: false
        }
        this.start = this.start.bind(this)
        this.decreaseExerciseTime = this.decreaseExerciseTime.bind(this)
        this.start_rest = this.start_rest.bind(this)
        this.decreaseRest = this.decreaseRest.bind(this)
        this.reset = this.reset.bind(this)
    }

    start() {
        this.setState({isRunnig: true})
        interval = setInterval(() => {
            this.decreaseExerciseTime()
        }, 10)
    }

    stop() {
        this.setState({isRunnig: false})
        clearInterval(interval)
    }

    start_rest() {
        rest_interval = setInterval(() => {
            this.decreaseRest()
        }, 10)
    }

    stopRest() {
        clearInterval(rest_interval)
    }

    // return false if time is zero and time is changed by reference
    decreaseTime(time) {

        if (parseInt(time.milisec) !== 0) {
            time.milisec = parseInt(time.milisec) - 1
        }
        else if (parseInt(time.sec) !== 0) {
            time.sec = parseInt(time.sec) - 1
            time.milisec = 59
        }
        else if (parseInt(time.min) !== 0) {
            time.min = parseInt(time.min) - 1
            time.sec = 59
        }
        else
            return false

    }

    decreaseRest() {

        let time = this.state.rest
        
        if(this.decreaseTime(time) === false) {
            this.setState({ isRestTime: false })
            this.stopRest()
            this.initialiseRoutine()
            this.start()
        }
        else
            this.setState({ rest: time })
    }

    initialiseRest() {
        let { routine } = this.state
        let rest = {}
        rest['min'] = routine.restBetweenSets.getHours()
        rest['sec'] = routine.restBetweenSets.getMinutes()
        rest['milisec'] = 0

        this.setState({ isRestTime: true, rest })
    }

    decreaseExerciseTime() {

        let { routine, active, complete, set_count } = this.state

        if (active >= routine.exercise.length) {
            if ((routine.numberOfSets - set_count) <= 0 ) {
                complete = true
                this.stop()
            }
            else {
                set_count++
                this.initialiseRest()
                this.setState({ set_count }) // this will not interfere with setState of routine
                this.stop()
                this.start_rest()
                return
            }
        }
        else {
            let time = routine.exercise[active].time
            if(this.decreaseTime(time) === false) {
                active++
            }
        }
        this.setState({ routine, active, complete, set_count })
    }

    componentDidMount() {
        this.initialiseRoutine()
    }

    componentWillUnmount() {
        this.stop()
        this.stopRest()
    }

    reset(){
        this.stop()
        this.stopRest()
        this.initialiseRoutine()
        this.setState({set_count: 1, complete: false, rest: false})
    }

    initialiseRoutine() {
        // routine = this.props.route.params.workout (galat reference same) we manulay have to add each object
        // because we are changing time here and it will change time in workoutList as well sos next time or for next set it will not work
        // we just need to allocate memory to time

        let r = this.props.route.params.workout

        let routine = {}
        routine['workoutName'] = r.workoutName
        routine['numberOfSets'] = r.numberOfSets
        routine['exercise'] = []
        
        routine['restBetweenSets'] = r.restBetweenSets
        routine['exercise'] = []
        
        r.exercises.forEach((exc) => {
            let temp_exc = {}
            temp_exc.name = exc.name
            console.log(exc.time)
            temp_exc.time = { min: exc.time.getHours(), sec: exc.time.getMinutes(), milisec: 0 }
            routine['exercise'].push(temp_exc)
        })
        
        this.setState({ routine, active: 0 })
    }


    render() {
        let { routine, active, complete, set_count, isRestTime, rest, isRunnig } = this.state

        return <View style={styles.container}>
            <ScrollView>
                {/* <Text style={styles.heading} >{routine.workoutName}</Text> */}
                {!complete && <Text style={styles.count}>Remaining Sets {routine.numberOfSets - set_count + 1}</Text>}
                {!complete && !isRestTime && routine.exercise.map((exc, index) => {
                    let style = 'upcomingItem'
                    if (index === active)
                        style = 'activeItem'
                    else if (index < active)
                        style = 'completeItem'
                    return <View  style={ styles[style] } key={index}>
                        <Text style={styles.remainingTime} >{this.fromatTime(exc.time)}</Text>
                        <Text style={styles.exerciseName} >{exc.name}</Text>
                    </View>
                })}
                {isRestTime && <View style={styles.completeItem}><Text style={styles.remainingTime}>Next Set In {this.fromatTime(rest)} </Text></View>}
                {complete && <View style={styles.completeItem}><Text style={styles.remainingTime}>complete</Text></View>}
            </ScrollView>

            <TouchableOpacity style={styles.startButton} onPress={()=>{ isRunnig?this.stop():this.start() }} > 
                <Text> |> </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={this.reset} > 
                <Text>:=:</Text>
            </TouchableOpacity>

        </View>
    }
    fromatTime(time) {
        let result = ''
        for(let key in time) {
            let t = parseInt(time[key])
            if(t > 9) {
                result += t
            }
            else {
                result += ('0' + t)
            }
            if(key !== 'milisec')
                result += ':'
        }
        return result
    }
}

export default Workout