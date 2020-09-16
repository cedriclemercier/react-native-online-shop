import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, ScrollView, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';

// Functional Components
import * as authActions from '../../store/actions/auth';

// UI Components
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import DefaultButton from '../../components/UI/DefaultButton';
import Layout from '../../util/Layout';
import Title from '../../components/UI/Title';
import Colors from '../../constants/Colors';

// Other actions
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };

      // Check if the entire form object values are valid
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formValidity: updatedFormIsValid,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
      };
    default:
      return;
  }
};

const AuthScreen = (props) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
    } else {
      action = authActions.login(formState.inputValues.email, formState.inputValues.password);
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Shop');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);

    if (error) {
      Alert.alert('Oh no!😔', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (inputType, inputValue, isValid) => {
      dispatchFormState({ type: FORM_INPUT_UPDATE, value: inputValue, isValid: isValid, input: inputType });
    },
    [dispatchFormState]
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formValidity: false,
  });

  return (
    <Layout linearGradient={['#ff7e5f', '#feb47b']}>
      <Title>{!isSignup ? 'Log in' : 'Sign up'}</Title>

      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='Email'
              keyboardType='email-address'
              required
              email
              autoCapitalize='none'
              errorText='Please enter a valid email address.'
              initialValue=''
              onInputChange={inputChangeHandler}
            />
            <Input
              id='password'
              label='Password'
              keyboardType='default'
              secureTextEntry
              required
              minLength={5}
              autoCapitalize='none'
              errorText='Please enter a valid password.'
              initialValue=''
              onInputChange={inputChangeHandler}
            />
          </ScrollView>
          {isLoading ? (
            <ActivityIndicator size='large' color={Colors.primary} />
          ) : (
            <DefaultButton mode='contained' onPress={authHandler} disabled={!formState.formValidity}>
              {!isSignup ? 'Log in' : 'Sign up'}
            </DefaultButton>
          )}

          <DefaultButton
            onPress={() => {
              setIsSignup((prevState) => !prevState);
            }}>
            Switch to {isSignup ? 'Log in' : 'Sign up'}
          </DefaultButton>
        </Card>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    backgroundColor: '#fff',
    padding: 20,
  },
  screen: {
    alignItems: 'center',
  },
});
