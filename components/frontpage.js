import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, View, Dimensions, ImageBackground,Text } from 'react-native';


const AutoScrollCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { id: 1, source: require('../front1.jpeg') , instru:"Welcome"},
    { id: 2, source: require('../front2.webp'), instru:"Edit and Remove Background using Editor" },
    { id: 3, source: require('../front4.jpg') , instru:"To replace back -ground select photo whose back -ground has been removed"},
    { id: 4, source: require('../img3.jpg') , instru:"Click on Preview to see"},
  ];

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= images.length) {
        nextIndex = 0;
      }
      carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3000); // Interval of 10 seconds (adjust as needed)

    return () => {
      clearInterval(scrollInterval);
    };
  }, [activeIndex, images.length]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
    
      <ImageBackground source={item.source} style={styles.image} />
      <Text style={styles.textStyle}>{item.instru}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={carouselRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:Dimensions.get('window').height,
    position:'absolute'
    
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    zIndex:0,
    backgroundColor: '#dcf0ff'
   
  },
  image: {
    width: '60%',
    height: '100%',
    position:'absolute',
   
    zIndex:0
  },
  textStyle: {
    left:Dimensions.get('window').width/2-40,
    top:10,
    width:Dimensions.get('window').width/2,
    fontSize:25,
    fontWeight:'bold',
    fontFamily: 'Arial',
    textAlign:'justify',
    
   
   
  },
});

export default AutoScrollCarousel;
