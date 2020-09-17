import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, TextStyle, Image, ImageStyle } from 'react-native';
import useTheme from "../../hooks/useTheme";
import { AppTheme, AppConstants } from "../../config/DefaultConfig";
import ThemedText from '../UI/ThemedText';
import useConstants from '../../hooks/useConstants';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  size: string,
  color: string,
};

const BagItem: React.FunctionComponent<Props> = ({
  size,
  color,
  item,
  onRemove,
  categories
}: Props) => {
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();

  return (
    <View style={[style.contentContainer, { borderColor: theme.lightTextColor }]}>
      <View style={[style.container, { paddingTop: 20 }]}>
        <View style={[style.childContainer, style.leftContainer]}>
          <Image style={style.imageStyle} source={{ uri: item.productImage }} />
        </View>
        <View style={[style.childContainer, style.rightContainer, style.extraStyle, { justifyContent: "flex-start" }]}>
          <View style={[style.container, { paddingRight: 0 }]}>
            <View style={[style.childContainer, style.leftContainer, style.extraStyle]}>
              <ThemedText styleKey="textColor" style={style.content}>{item.productTitle}</ThemedText>
              <ThemedText styleKey="textColor" style={{color: theme.lightTextColor}}>{categories[item.productCategory]}</ThemedText>
            </View>
            <View style={[style.childContainer, style.rightContainer, { flex: 1, alignSelf: "flex-start" }]}>
              <TouchableOpacity onPress={() => onRemove()}>
                <MaterialIcon name="trash-can-outline" size={20} color={theme.lightTextColor} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[style.container, { paddingRight: 0, flex: 1, alignSelf: "flex-end"}]}>
            <View style={[style.childContainer, style.leftContainer, { flex: 1, }]}>
              <ThemedText styleKey="textColor" style={{color: theme.lightTextColor}}>Quantity: {item.quantity}</ThemedText>
            </View>
            <View style={[style.childContainer, style.rightContainer, { flex: 1, }]}>
              <ThemedText styleKey="textColor">&#8377; {item.productPrice}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BagItem;

interface Style {
  container: ViewStyle;
  childContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  title: TextStyle;
  content: TextStyle;
  strike: TextStyle;
  imageStyle: ImageStyle;
  extraStyle: ViewStyle;
}

const style: Style = StyleSheet.create<Style>({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  contentContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  childContainer: {
    flex: 1,
    justifyContent: "center",
  },
  leftContainer: {
    alignItems: "flex-start",
    flex: 0,
  },
  rightContainer: {
    alignItems: "flex-end",
    flex: 0,
  },
  title: {
    fontSize: 25,
    paddingTop: 15,
  },
  content: {
    fontSize: 18,
  },
  strike: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  imageStyle: {
    width: 100,
    height: 100,
  },
  extraStyle: {
    flex: 3
  },
});
