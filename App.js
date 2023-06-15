
import { ScrollView, StyleSheet, View, Button, Text, Image, Alert, TouchableOpacity, Modal, Pressable, Dimensions, ImageBackground } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useState, useRef, useEffect } from 'react';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Platform } from "react-native";
import { CanvasAction, PESDK, TintMode, Tool } from "react-native-photoeditorsdk";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSlider from './components/slider';


import { launchImageLibrary } from 'react-native-image-picker'
import AutoScrollCarousel from './components/frontpage';
import WalkingKidAnimation from './components/walking';

import { PermissionsAndroid } from 'react-native';




export default function App() {

  const imagepaths = [require("./img1.jpg"), require("./img2.jpg"), require("./img3.jpg"), require("./img4.jpg"), require("./img5.jpg")];

  if (Platform.OS === 'android') {
    isReadGranted = Platform.Version >= 33 ? PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,) : PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
  }

  if ("granted" == PermissionsAndroid.RESULTS.GRANTED) {
    //Alert.alert("Welcome","Select image and then Editor will appear");
  }
  else {
    Alert.alert("Permission denied");
  }

  const [editedImageUri, setEditedImageuri] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [choice, setChoice] = useState("Preview image");
  const viewShotRef = useRef(null);
  const [replaceModal, setReplaceModal] = useState(false);
  const [bgindex, setBgIndex] = useState(require("./img1.jpg"));
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const scrollViewRef = useRef(null);
  const [bulk, setBulk] = useState([]);
  const handleNextButtonPress = () => {
    scrollViewRef.current.scrollTo({ x: Dimensions.get('window').width, animated: true });
  };
  const handleBackButtonPress = () => {
    scrollViewRef.current.scrollTo({ x: -Dimensions.get('window').width, animated: true });
  };
  // Function to open the image picker
  const openImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    }
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // Handle cancel event
        console.log('Image picker cancelled');
      } else if (response.errorMessage) {
        // Handle error event
        console.log('Image picker error:', response.error);
      } else {
        // Image selected successfully
        console.log('Selected image:', response.assets[0].uri);
        setImageUri(response.assets[0].uri);
      }
    });

  }
  async function handleEvent() {

    const configuration = {
      mainCanvasActions: [
        CanvasAction.UNDO,
        CanvasAction.REDO,
        CanvasAction.REMOVE_BACKGROUND
      ],



    };

    await PESDK.openEditor(imageUri, configuration)
      .then(result => {

        console.log(result.image);
        setEditedImageuri(result.image);
      })
      .catch(error => {
        console.log('Error opening photo editor:', error);
      });

  }

  function showimage() {
    console.log("true", editedImageUri);
    setShowImage(true);
  }
  function cancelPreview() {
    setShowImage(false);
  }
  function saveEditedImage() {
    if (editedImageUri) {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      CameraRoll.saveToCameraRoll(editedImageUri)
        .then(result => {
          console.log('Image saved to camera roll:', result);
          Alert.alert("Saved successfully", result);

          setEditedImageuri('');
        })
        .catch(error => {
          console.log('Failed to save image to camera roll:', error);
        });
    }
  };
  const saveOverlayImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      CameraRoll.save(uri);
      console.log('Overlay image saved successfully!', uri);
    } catch (error) {
      console.log('Failed to save overlay image:', error);
    }
  }
  async function handleReplace() {

    handleEvent()
    setReplaceModal(true);
  }
  function handlePress(prop) {
    console.log("prop", prop);

    setBgIndex(imagepaths[prop]);


  }
  useEffect(() => {
    checkWelcomeScreenStatus();
  }, []);

  const checkWelcomeScreenStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('welcome_screen_shown');
      if (value === null) {
        // Welcome screen has not been shown
        setShowWelcomeScreen(true);
        await AsyncStorage.setItem('welcome_screen_shown', 'true');
      } else {
        // Welcome screen has been shown
        setShowWelcomeScreen(false);
      }
    } catch (error) {
      // Handle error
      console.error('Error checking welcome screen status:', error);
    }
  };
  function handleWelcome() {
    setShowWelcomeScreen(false);
  }
  function customBg() {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 3
    }
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // Handle cancel event
        console.log('Image picker cancelled');
      } else if (response.errorMessage) {
        // Handle error event
        console.log('Image picker error:', response.error);
      } else {
        // Image selected successfully
        console.log('Selected image:', response.assets.length);
        const len= response.assets.length;
        const arr=[];
       if(len==3) 
        setBulk([response.assets[0].uri, response.assets[1].uri, response.assets[2].uri]);
      else if(len==2)
      setBulk([response.assets[0].uri, response.assets[1].uri]);
       else if(len==1)
       setBulk([response.assets[0].uri]);

      }
    });


  }
  function custom(prop)
  {
    setBgIndex({uri:bulk[prop]})
    
  }

  return (<View >

    <View>

      <Modal visible={showWelcomeScreen}  >
        <View style={{ backgroundColor: '#c5f6fa' }}>
          <View ><Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', color: 'black' }}>Welcome</Text></View>
          <View style={{ height: 40, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Pressable onPress={handleBackButtonPress} >
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}> Back  </Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>

              <Pressable onPress={handleNextButtonPress} >
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Next  </Text>
              </Pressable>

            </View>
          </View>
          <ScrollView ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEnabled={false} // Disable swipe gesture
            showsHorizontalScrollIndicator={false}>

            <AddSlider uri1={require('./wel1.jpg')} uri2={require('./wel2.jpg')} text1={"Change Background"} />
            
            <AddSlider uri1={require("./fil1.jpg")} uri2={require("./fil2.jpg")} text1={"Filter"} />
          </ScrollView>

          <View>
            <Pressable onPress={handleWelcome} >
              <Text style={{ fontSize: 50, textAlign: 'center', fontWeight: 'bold' }} >x</Text>
            </Pressable></View>

        </View>
      </Modal>
    </View>

    <AutoScrollCarousel />

    <WalkingKidAnimation />
    <View style={{ position: 'absolute', top: Dimensions.get('window').height / 2, left: Dimensions.get('window').width / 2 }}>

      <View style={styles.sButton}>

        <Button title='select image' onPress={openImagePicker}  >

        </Button>

        {imageUri && <Button title='open editor' onPress={handleEvent} ></Button>}
        {editedImageUri && (<Button title={choice} onPress={showimage} ></Button>)}
        {imageUri && (<Button title='Replace' onPress={handleReplace} ></Button>)}
      </View>
    </View>
    <Modal animationType="slide"
      transparent={false}
      visible={showImage}
      onRequestClose={() => {

        setShowImage(!showImage)
      }}>
      <ImageBackground source={{ uri: editedImageUri }} style={{ width: '100%', height: Dimensions.get('window').height / 1.11 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 3 }}>
        <Button title="save image" onPress={saveEditedImage} style={styles.saveButton}></Button>
        <View style={{ width: 10 }}></View>
        <Button title='cancel' color={'red'} onPress={cancelPreview}> style={styles.cancelButton} </Button>
      </View>

    </Modal>
    <Modal animationType="slide"
      transparent={false}
      visible={replaceModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setReplaceModal(!replaceModal);
      }}
    >
      {imageUri && (<View >
        <ViewShot ref={viewShotRef} style={styles.viewShotContainer}>
          <Image
            source={bgindex}
            style={styles.backgroundImage}
          />
          <Image
            source={{ uri: editedImageUri }}
            style={styles.overlayImage}
          />
        </ViewShot>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={styles.saveButton} onPress={saveOverlayImage}>
            <Text style={styles.saveButtonText}>Save Image</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }}></View>
          <Pressable style={styles.cancelButton}

            onPress={() => setReplaceModal(!replaceModal)}>
            <Text style={styles.saveButtonText}>Cancel</Text>
          </Pressable>
        </View>
        <View style={{ paddingTop: 10 }}>
          <ScrollView horizontal={true} >
            <TouchableOpacity onPress={() => handlePress(0)}>
              <Image source={imagepaths[0]} style={styles.background_image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(1)}>
              <Image source={imagepaths[1]} style={styles.background_image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(2)}>
              <Image source={imagepaths[2]} style={styles.background_image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(3)}>
              <Image source={imagepaths[3]} style={styles.background_image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(4)}>
              <Image source={imagepaths[4]} style={styles.background_image} />
            </TouchableOpacity>
            {bulk[0]&&<TouchableOpacity onPress={() => custom(0)}>
              <Image source={{uri:bulk[0]}} style={styles.background_image} />
            </TouchableOpacity>}
            {bulk[1]&&<TouchableOpacity onPress={() => custom(1)}>
              <Image source={{uri:bulk[1]}} style={styles.background_image} />
            </TouchableOpacity>}
            {bulk[2] && <TouchableOpacity onPress={() => custom(2)}>
              <Image source={{uri:bulk[2]}} style={styles.background_image} />
            </TouchableOpacity>}



          </ScrollView>
          <Pressable 

            onPress={customBg}>
            <Text style={{textAlign:'center',fontSize:20}}>Custom background</Text>
          </Pressable>

         




        </View>
      </View>)}
    </Modal>


  </View>


  );
}

const styles = StyleSheet.create({

  viewShotContainer: {
    position: 'relative',
    height: 500

  },
  backgroundImage: {
    width: '100%',
    height: '100%',


  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',


  },
  saveButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    flex: 2,



  },
  sButton: {
    minHeight: 160,
    maxHeight: 200,
    flexDirection: 'column',
    borderRadius: 5,
    flex: 1,

    justifyContent: 'space-evenly'




  },
  cancelButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    flex: 2,



  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'

  },
  background_image: {


    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 10,
    height: 100,
    width: 150,


  }
});
