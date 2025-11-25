import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { AppContext } from '../store/app-context';

export default function LoginScreen() {
  const { login } = useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateInput = () => {
    setUsernameError(username.trim() ? false : true);
    setPasswordError(password.trim() ? false : true);
  };

  const handleLogin = async () => {
    validateInput();

    if (!username.trim() || !password.trim()) {
      return;
    }

    const trimmedUsername = username.trim();
    login(trimmedUsername, password);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#000' : theme.colors.background },
      ]}
    >
      <Image
        source={require('../assets/images/sierra.png')}
        resizeMode="contain"
        style={{
          height: 150,
          width: 150,
          marginBottom: 32,
          alignSelf: 'center',
        }}
      />
      <Text variant="displaySmall" style={{ textAlign: 'center' }}>
        Welcome Back
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
        Login to Continue
      </Text>
      <View style={{ marginBottom: 12, marginTop: 20 }}>
        <TextInput
          mode="outlined"
          label={'Username'}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          error={usernameError}
        />
        {usernameError && (
          <Text style={{ color: theme.colors.error }}>
            Username cannot be empty
          </Text>
        )}
      </View>
      <View style={{ marginBottom: 12 }}>
        <TextInput
          mode="outlined"
          label={'Password'}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setShowPassword(prevState => !prevState)}
            />
          }
          error={passwordError}
        />
        {passwordError && (
          <Text style={{ color: theme.colors.error }}>
            Password cannot be empty
          </Text>
        )}
      </View>
      <Button onPress={handleLogin} style={{ alignSelf: 'center' }}>
        Login
      </Button>
      <Button
        mode="text"
        style={{ alignSelf: 'center' }}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Create an Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
