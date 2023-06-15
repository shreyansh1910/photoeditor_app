import { useState } from 'react';
import { View,Button,Text,Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'

function Remove_bg() {
    const [image, setImage] = useState(null);
    const [bgremove, setBgremove] = useState(null);
  

        const apikey = 'p1KTsKA1tdqgANVXFVtNXKXA'
        const url = 'https://api.remove.bg/v1.0/removebg'
        const removeBackground = async () => {
            
        
            try {
              const formData = new FormData();
              formData.append('image', {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'image.jpg',
              });
        
              const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                  'X-Api-Key': apikey,
                },
                body: formData,
              });
        
              const result = await response.json();
              console.log('Background removal result:', result);
        
              // Handle the result as needed
            } catch (error) {
              console.error('Error removing background:', error);
            }
          };

 
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
            console.log('Selected image:', response);
            setImage(response.assets[0].uri);
          }
        });
    }
    return (
        <View>
          <Button title="Replace  Image" onPress={openImagePicker} />
          {image && (
            <View>
              <Image source={image} style={{ width: 200, height: 200 }} />
              <Button title="Remove Background" onPress={removeBackground} />
            </View>
          )}
        </View>
      );
    

}
export default Remove_bg;