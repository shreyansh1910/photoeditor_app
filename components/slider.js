import React, { useState } from 'react';
import { View, Image, StyleSheet,Text, ImageBackground,Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

function AddSlider({uri1,uri2,text1}) {
    const imageWidth = Dimensions.get('window').width/1; // Adjust this value to match your image width
    
    
    

    

  const [revealWidth, setRevealWidth] = useState(imageWidth/2);

  const handleSliderChange = (value) => {
    const width = (value / 100) * imageWidth;
    setRevealWidth(width);
  };

  return (
    <View>
    <View style={{borderRadius:20,overflow:'hidden',width:imageWidth}}>
      <View style={{height:500,width:revealWidth,overflow:'hidden'}}>
      
        <Image          source={uri1}
          style={{width:imageWidth,height:500}}
          resizeMode='cover'
       
        />
    
         </View>
        <ImageBackground source={uri2}  style={{width:imageWidth,height:500,position:'absolute',zIndex:-1}}
          resizeMode='cover'/>
       <Slider
        style={[styles.slider,{width:imageWidth}]}
        minimumValue={0}
        maximumValue={100} // Adjust the maximum value as per your requirement
        value={50}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="transparent"
        trackStyle={styles.track}
      />
      
    </View>
    <Text style={styles.text1}>{text1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 
 
  slider: {
    
    height:500,
  
    position:'absolute',
    top:0
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  text1:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold'

  }
});

export default AddSlider;
