import { useNavigation } from '@react-navigation/native';
import { Alert, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import countries from '../utils/CountryCodes';
import { useState } from 'react';
import axios from 'axios';

export default function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [country, setCountry] = useState('+91');

  const [error, setError] = useState({
    emptyUsername: false,
    smallUsername: false,
    emptyPhone: false,
    invalidPhone: false,
    emptyPassword: false,
    smallPassword: false,
    mismatchPassword: false,
  });

  const validateInput = () => {
    let errors = {
      emptyUsername: false,
      smallUsername: false,
      emptyPhone: false,
      invalidPhone: false,
      emptyPassword: false,
      smallPassword: false,
      mismatchPassword: false,
    };

    let isValid = true;

    if (!username.trim()) {
      errors.emptyUsername = true;
      isValid = false;
    } else if (username.trim().length < 3) {
      errors.smallUsername = true;
      isValid = false;
    }

    if (!phone.trim()) {
      errors.emptyPhone = true;
      isValid = false;
    } else if (phone.trim().length !== 10) {
      errors.invalidPhone = true;
      isValid = false;
    }

    if (!password) {
      errors.emptyPassword = true;
      isValid = false;
    } else if (password.length < 4) {
      errors.smallPassword = true;
      isValid = false;
    }

    if (confirmPassword !== password) {
      errors.mismatchPassword = true;
      isValid = false;
    }

    setError(errors);

    return isValid;
  };

  const handleRegister = async () => {
    console.log({ password, confirmPassword });
    if (!validateInput()) return;

    setRegisterLoading(true);
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      await axios.post('https://sierra-backend.onrender.com/register', {
        username: trimmedUsername,
        password: trimmedPassword,
        phone: phone,
      });

      Alert.alert('Success', 'Account created successfully');
      navigation.goBack();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occured';
      Alert.alert('Error', errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark ? '#000' : theme.colors.background,
      }}
    >
      <IconButton
        icon={'arrow-left'}
        iconColor={theme.colors.primary}
        style={{ marginTop: 24, marginLeft: 8 }}
        onPress={() => navigation.goBack()}
      />
      <View style={{ marginTop: 16 }}>
        <Text variant="displaySmall" style={{ textAlign: 'center' }}>
          Create an Account
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: 'center', marginTop: 8 }}
        >
          Sign up to get started
        </Text>
      </View>
      <View style={{ marginHorizontal: 24, marginTop: 24 }}>
        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          error={error.emptyUsername || error.smallUsername}
        />
        {(error.emptyUsername && (
          <Text style={{ color: theme.colors.error }}>
            ⓘ Username cannot be empty
          </Text>
        )) ||
          (error.smallUsername && (
            <Text style={{ color: theme.colors.error }}>
              ⓘ Username must be greater than 3 characters
            </Text>
          ))}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Dropdown
            data={countries}
            labelField="label"
            valueField="code"
            maxHeight={300}
            style={{
              flex: 1,
              paddingHorizontal: 10,
            }}
            search
            placeholder="Select country"
            searchPlaceholder="Search..."
            activeColor={theme.colors.primary}
            value={country}
            onChange={item => setCountry(item.code)}
            itemTextStyle={{
              color: theme.colors.onBackground,
            }}
            selectedTextStyle={{ color: theme.colors.onBackground }}
            containerStyle={{ backgroundColor: theme.colors.surface }}
          />
          <View style={{ flex: 1 }}>
            <TextInput
              label="Phone"
              mode="outlined"
              value={phone}
              onChangeText={setPhone}
              error={error.emptyPhone || error.invalidPhone}
            />
            {(error.emptyPhone && (
              <Text style={{ color: theme.colors.error }}>
                ⓘ Phone cannot be empty
              </Text>
            )) ||
              (error.invalidPhone && (
                <Text style={{ color: theme.colors.error }}>
                  ⓘ Invalid phone number
                </Text>
              ))}
          </View>
        </View>
        <TextInput
          label="Password"
          mode="outlined"
          style={{ marginTop: 8 }}
          value={password}
          onChangeText={setPassword}
          error={error.emptyPassword || error.smallPassword}
          right={
            <TextInput.Icon
              icon={passwordShown ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setPasswordShown(prevState => !prevState)}
            />
          }
          secureTextEntry={!passwordShown}
        />
        {(error.emptyPassword && (
          <Text style={{ color: theme.colors.error }}>
            ⓘ Password cannot be empty
          </Text>
        )) ||
          (error.smallPassword && (
            <Text style={{ color: theme.colors.error }}>
              ⓘ Password must have length greater than or equal to 8
            </Text>
          ))}
        <TextInput
          label="Confirm Password"
          mode="outlined"
          style={{ marginTop: 8 }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={error.mismatchPassword}
          right={
            <TextInput.Icon
              icon={confirmPasswordShown ? 'eye-off-outline' : 'eye-outline'}
              onPress={() => setConfirmPasswordShown(prevState => !prevState)}
            />
          }
          secureTextEntry={!confirmPasswordShown}
        />
        {error.mismatchPassword && (
          <Text style={{ color: theme.colors.error }}>
            ⓘ Passwords don't match
          </Text>
        )}
      </View>
      <View style={{ marginTop: 24 }}>
        <Button style={{ alignSelf: 'center' }} onPress={handleRegister}>
          Register
        </Button>
        <Button
          style={{ alignSelf: 'center' }}
          onPress={() => navigation.goBack()}
        >
          Already have an account? Login
        </Button>
      </View>
    </View>
  );
}
