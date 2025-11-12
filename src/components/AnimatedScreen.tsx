import React from "react";
import { StyleSheet, Animated, Easing } from "react-native";

interface AnimatedScreenProps {
  children: React.ReactNode;
  direction?: "forward" | "backward";
  type?: "fade" | "slide" | "scale";
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({
  children,
  direction = "forward",
  type = "fade",
}) => {
  const opacityRef = React.useRef<Animated.Value>(new Animated.Value(0));
  const translateXRef = React.useRef(
    new Animated.Value(direction === "forward" ? 100 : -100),
  );
  const scaleRef = React.useRef(new Animated.Value(0.95));

  const opacity = opacityRef.current;
  const translateX = translateXRef.current;
  const scale = scaleRef.current;

  React.useEffect(() => {
    // Reset values when direction or type changes
    if (type === "slide") {
      translateX.setValue(direction === "forward" ? 100 : -100);
    } else if (type === "scale") {
      scale.setValue(0.95);
    }
    opacity.setValue(0);

    // Entrance animation with smooth timing
    const animations: Animated.CompositeAnimation[] = [];

    if (type === "fade") {
      animations.push(
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );
    } else if (type === "slide") {
      animations.push(
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(translateX, {
            toValue: 0,
            damping: 18,
            stiffness: 100,
            mass: 0.8,
            useNativeDriver: true,
          }),
        ])
      );
    } else if (type === "scale") {
      animations.push(
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            damping: 12,
            stiffness: 120,
            mass: 0.7,
            useNativeDriver: true,
          }),
        ])
      );
    }

    Animated.parallel(animations).start();
  }, [type, direction, opacity, translateX, scale]);

  const getAnimatedStyle = () => {
    if (type === "fade") {
      return {
        opacity,
      };
    } else if (type === "slide") {
      return {
        opacity,
        transform: [{ translateX }],
      };
    } else if (type === "scale") {
      return {
        opacity,
        transform: [{ scale }],
      };
    }
    return {};
  };

  return (
    <Animated.View style={[styles.container, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
