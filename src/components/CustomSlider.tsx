import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, Text } from 'react-native';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  onValueChange: (val: number) => void;
  label?: string;
  isVertical?: boolean;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  onValueChange,
  label,
  isVertical = true
}) => {
  const range = max - min;
  
  // Calculate percentage
  const percentage = Math.max(0, Math.min(100, ((value - min) / range) * 100));

  const [containerSize, setContainerSize] = useState(0);

  // We need to keep a ref to the value when touch starts
  const startValueRef = useRef(value);
  
  // Keep startValueRef updated if value changes from outside (e.g. preset change)
  startValueRef.current = value;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValueRef.current = value;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (containerSize === 0) return;
        
        let diffPercent = 0;
        if (isVertical) {
          // dy is negative when moving up, positive when moving down
          diffPercent = -(gestureState.dy / containerSize) * 100;
        } else {
          diffPercent = (gestureState.dx / containerSize) * 100;
        }
        
        const newValue = startValueRef.current + (diffPercent / 100) * range;
        onValueChange(Math.round(Math.max(min, Math.min(max, newValue))));
      },
    })
  ).current;

  return (
    <View style={[styles.wrapper, isVertical && styles.wrapperVertical]}>
      <View 
        style={[styles.container, isVertical ? styles.containerVertical : styles.containerHorizontal]}
        onLayout={(e) => setContainerSize(isVertical ? e.nativeEvent.layout.height : e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        {isVertical ? (
          <View style={[styles.fillVertical, { height: `${percentage}%` }]} />
        ) : (
          <View style={[styles.fillHorizontal, { width: `${percentage}%` }]} />
        )}
        <View 
          style={[
            styles.thumb, 
            isVertical ? { bottom: `${percentage}%`, marginBottom: -10 } : { left: `${percentage}%`, marginLeft: -10 }
          ]} 
          pointerEvents="none"
        />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    margin: 10,
  },
  wrapperVertical: {
    height: 150,
  },
  container: {
    backgroundColor: '#333',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  containerVertical: {
    width: 20,
    flex: 1,
    marginBottom: 8,
  },
  containerHorizontal: {
    height: 20,
    width: '100%',
  },
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  fillVertical: {
    width: '100%',
    backgroundColor: '#00d2ff',
  },
  fillHorizontal: {
    height: '100%',
    backgroundColor: '#00d2ff',
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  label: {
    color: '#e1e2eb',
    fontSize: 12,
  }
});
