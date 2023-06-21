import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Camera, CameraType, FaceDetectionResult } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { styles } from "./styles";

export default function Home() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [faceDetected, setFaceDetected] = useState(false);
  const [expression, setExpression] = useState("");

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
    borderColor: "pink",
    borderWidth: 5,
  }));

  const animatedStyleText = useAnimatedStyle(() => ({
    color: 'turquoise',
    fontSize: 30
  }));

  useEffect(() => {
    requestPermission();
  }, []);

  function handleOnFaceDetected({ faces }: FaceDetectionResult) {
      const face = faces[0] as any;
      if (face) {
    //   console.log(face);
      const { size, origin, } =
        face.bounds;
        const { rightEyeOpenProbability, leftEyeOpenProbability  } = face
      setFaceDetected(true);

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      };

      if (leftEyeOpenProbability < 0.9 && rightEyeOpenProbability < 0.9) {
        setExpression("You need Coffee!");
      } else {
        // console.log('out',);
        setExpression("");
      }
    } else {
      setFaceDetected(false);
    }
  }

  if (!permission?.granted) return;
  return (
    <View style={styles.container}>
      {faceDetected && (
        <Animated.View style={animatedStyle}>
          <Animated.Text style={animatedStyleText}>{expression}</Animated.Text>
        </Animated.View>
      )}
      <Camera
        style={styles.camera}
        type={CameraType.front}
        // ratio='4:3'
        onFacesDetected={handleOnFaceDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </View>
  );
}
