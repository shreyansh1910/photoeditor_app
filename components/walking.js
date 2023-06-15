import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';

const WalkingKidAnimation = () => {
    
        return (
          <View>
            <FastImage
              source={require('../logo2.png')}
              style={{ width: 200, height: 200 ,zIndex:1 ,position: 'absolute',top:180,left:160}}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        );
      }
export default WalkingKidAnimation;
