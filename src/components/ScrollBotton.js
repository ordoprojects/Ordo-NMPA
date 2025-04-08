import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  startClock,
  stopClock,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  Clock,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 300,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}

export default function SwipeableButton() {
  const translateX = new Value(0);
  const gestureState = new Value(-1);
  const offsetX = new Value(0);
  const clock = new Clock();

  const onGestureEvent = event([
    {
      nativeEvent: {
        translationX: translateX,
        state: gestureState,
      },
    },
  ]);

  const transX = cond(
    eq(gestureState, State.END),
    [
      set(offsetX, runTiming(clock, translateX, 0)),
      offsetX,
    ],
    [
      set(offsetX, translateX),
      offsetX,
    ]
  );

  const translateXStyle = {
    transform: [
      {
        translateX: interpolate(transX, {
          inputRange: [-300, 0, 300],
          outputRange: [-150, 0, 150],
          extrapolate: Extrapolate.CLAMP,
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEvent}
      >
        <Animated.View style={[styles.button, translateXStyle]}>
          <Text style={styles.buttonText}>Swipe Me</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
