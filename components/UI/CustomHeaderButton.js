import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { AntDesign } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const CustomHeaderButton = (props) => {
  return <HeaderButton {...props} IconComponent={AntDesign} iconSize={26} color={Colors.primary} />;
};

export default CustomHeaderButton;
