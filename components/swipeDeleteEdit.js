import React, { Component } from 'react'
import { StyleSheet, Animated, PanResponder, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { clearUpdateCacheExperimentalAsync } from 'expo/build/Updates/Updates'

const width = Dimensions.get("window").width

const styles = StyleSheet.create({
    outsideView: {
    },
    options: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'black',
        height: 10,
    },
    editOption: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'grey',
        alignItems: 'center'
    },
    editIcon: {
    },
    deleteOption: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'red',
        alignItems: 'center'
    }
})

export default class SwipeDeleteEdit extends Component {
    constructor(props) {
        super(props)

        this.opacity = new Animated.Value(1) /* interpolated as [0, 1, 2] -> [0, 1, 2] so for 0 -> 1 -> 0 use tovalue = 2*/
        this.translateX = new Animated.Value(0)
        this.holdGesture = null
        this.isHolding = false

        this.onPressIn = this.onPressIn.bind(this)
        this.onPressOut = this.onPressOut.bind(this)
        this.onPress = this.onPress.bind(this)

        this.panResponder = PanResponder.create({
            // onMoveShouldSetResponder: () => true,
            onMoveShouldSetPanResponder: (evt, {dx, dy}) => {
                if(Math.abs(dx) < .1*width)
                    return false
                console.log('on move');
                return true
            },
            onPanResponderGrant: (evt, gestureState) => {
                console.log('grant')
                this.isHolding = false
                this.isSingleClick = true

                // Animated.timing(this.opacity, {
                //     toValue: .3,
                //     duration: 100
                // }).start(() => {
                //     // this.props.onPress()
                //     // this.opacity.setValue(1)
                // })
                // this.holdGesture = setTimeout(() => {
                //     this.isHolding = true

                //     // call holding fxn here
                //     if(this.props.onHold) {
                //         this.props.onHold()
                //     }

                //     Animated.timing(this.opacity, {
                //         toValue: 1,
                //         duration: 50
                //     }).start(() => {
                //         // this.props.onPress()
                //         // this.opacity.setValue(1)
                //     })
                // }, 500);
            },
            onPanResponderMove: (e, { dx }) => {

                if (Math.abs(dx) < .05 * width) {
                    return
                }
                // this.opacity.setValue(1)
                // this.isSingleClick = false
                // if (this.holdGesture !== null) {
                //     clearTimeout(this.holdGesture)
                //     this.holdGesture = null
                //     this.isHolding = false
                //     console.log('hold cancelled')
                // }
                if (dx < 0 && Math.abs(dx) <= (.325 * width))
                    this.translateX.setValue(dx)
                else if (dx > 0)
                    Animated.spring(this.translateX, {
                        toValue: 2,
                        bounciness: 10
                    }).start();
            },
            onPanResponderRelease: (e, gestureState) => {
                Animated.timing(this.opacity).stop()

                let { dy, dx, vx } = gestureState
                console.log(`on release dx = ${dx}`)

                // if (this.isHolding) {
                //     console.log('hold triggered')
                // }
                // else if (this.isSingleClick) {
                //     console.log('open')
                //     if(this.props.onPress)
                //         this.props.onPress()
                    
                //     Animated.timing(this.opacity, {
                //         toValue: 1,
                //         duration: 50
                //     }).start(() => {
                //         this.opacity.setValue(1)
                //     });
                //     return
                // }
                // else 
                if ((dx < 0 && Math.abs(dx) < (.25 * width)) || dx > 0) {
                    Animated.spring(this.translateX, {
                        toValue: 0,
                        bounciness: 10
                    }).start();
                }
                else {
                    Animated.spring(this.translateX, {
                        toValue: -.25 * width,
                        bounciness: 10
                    }).start();
                }
            }
        })
        this.edit = this.edit.bind(this)
        this.delete = this.delete.bind(this)
    }

    onPressIn() {
        this.holdGesture = setTimeout(() => {
            // hold fxn
            this.isHolding = true
            Animated.spring(this.translateX, {
                toValue: -.25 * width,
                duration: 50,
                bounciness: 10
            }).start();
            console.log('hold')
        }, 500);
    }
    onPressOut() {
        if(this.holdGesture)
            clearTimeout(this.holdGesture)
    }
    onPress() {
        if(this.isHolding || !this.props.onPress) {
            
        }
        else {
            this.props.onPress()
        }
    }

    edit() {
        this.translateX.setValue(0)
        if(this.props.editFxn)
            this.props.editFxn()
    }
    delete() {
        if(this.props.deleteFxn)
            this.props.deleteFxn()
    }
    render() {
        return <Animated.View style={{ opacity: this.opacity.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }), ...styles.outsideView }} >
            <Animated.View style={{ transform: [{ translateX: this.translateX }] }} {...this.panResponder.panHandlers}>
                <TouchableOpacity onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress}>
                    {this.props.children}
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ width: this.translateX.interpolate({ inputRange: [-1, 1], outputRange: [1, -1] }), ...styles.options, ...this.props.style }}>
                <TouchableOpacity style={styles.editOption} onPress={this.edit}>
                    <Animated.View style={[styles.editIcon, { width: this.translateX.interpolate({ inputRange: [-1, 0, 1], outputRange: [-.5, 0, 0] }), overflow: "hidden" }]}>
                        <FontAwesomeIcon icon={faEdit} size={25} />
                    </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteOption} onPress={this.delete}>
                    <Animated.View style={[styles.editIcon, { width: this.translateX.interpolate({ inputRange: [-1, 0, 1], outputRange: [-.5, 0, 0] }), overflow: "hidden" }]}>
                        <FontAwesomeIcon icon={faTrash} size={25} />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    }
}