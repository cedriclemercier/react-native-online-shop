import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';

// Redux state
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../store/actions/product';

// Header Items
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

// UI Items
import Layout from '../../util/Layout';
import Title from '../../components/UI/Title';
import Colors from '../../constants/Colors';
import Input from '../../components/UI/Input';

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

const EditProductScreen = (props) => {
  const dispatch = useDispatch();
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector((state) => state.products.userProducts.find((el) => el.id === prodId));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formValidity: editedProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error ocurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formValidity) {
      Alert.alert('Some fields have invalid input!', 'Please check your form inputs again', [{ text: 'Okay' }]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  // Function that runs when inputs change, inputValue and isValue come from the children component, Input
  const inputChangedHandler = useCallback(
    (inputType, inputValue, isValid) => {
      dispatchFormState({ type: FORM_INPUT_UPDATE, value: inputValue, isValid: isValid, input: inputType });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  return (
    <Layout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={100}>
        <ScrollView>
          <Title>{props.navigation.getParam('productId') ? 'Edit Product' : 'Add Product'}</Title>
          <View style={styles.form}>
            <Input
              id='title'
              label='Title'
              errorText='Please input a valid title'
              keyboardType='default'
              autoCapitalize='sentences'
              autoCorrect
              returnKeyType='next'
              onInputChange={inputChangedHandler}
              initialValue={editedProduct ? editedProduct.title : ''}
              initiallyValid={!!editedProduct}
              required
            />
            <Input
              id='imageUrl'
              keyboardType='default'
              label='Image Url'
              errorText='Please input a valid image URL'
              onInputChange={inputChangedHandler}
              initialValue={editedProduct ? editedProduct.imageUrl : ''}
              initiallyValid={!!editedProduct}
              required
            />
            <Input
              id='description'
              keyboardType='default'
              autoCapitalize='sentences'
              autoCorrect
              label='Description'
              errorText='Please input a valid description'
              multiline
              numberOfLines={3}
              onInputChange={inputChangedHandler}
              initialValue={editedProduct ? editedProduct.description : ''}
              initiallyValid={!!editedProduct}
              required
            />
            {editedProduct ? null : (
              <Input
                id='price'
                keyboardType='decimal-pad'
                returnKeyType='next'
                label='Price'
                errorText='Please input a valid price'
                onInputChange={inputChangedHandler}
                required
                min={0}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submit = navData.navigation.getParam('submit');
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Save' iconName='check' onPress={submit} />
      </HeaderButtons>
    ),
  };
};

export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
