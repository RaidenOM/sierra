import LottieView from 'lottie-react-native';
import { StatusBar, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Orbitron-Regular',
          fontSize: 48,
          zIndex: 10,
        }}
      >
        Sierra
      </Text>
      <View
        style={{
          position: 'absolute',
          zIndex: 0,
          width: 200,
          height: 200,
          borderRadius: 20,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(0, 70, 250)',
        }}
      >
        <LottieView
          source={require('../assets/lottie/splash_screen2.json')}
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
            aspectRatio: 1,
          }}
          resizeMode="cover"
        />
      </View>
      <Text
        style={{
          fontFamily: 'Orbitron-Regular',
          fontSize: 15,
          position: 'absolute',
          bottom: 50,
          color: '#9E9E9E',
        }}
      >
        Designed by Om Kumar
      </Text>
    </View>
  );
}
