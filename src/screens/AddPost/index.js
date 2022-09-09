import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Images} from 'src/theme';
import {connect} from 'react-redux';
import useForm from '../../utils/useForm';
import validator from '../../utils/validation';

//action
import {AddPostData} from '../../ScreenRedux/addPostRequest';
import { useIsFocused } from '@react-navigation/native';

const {closeIcon, colorAddIcon, circleClose} = Images;
const AddPost = props => {
  const {navigation, AddPostData} = props;

  const [showPost, setShowPost] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [content, setContent] = useState(false);
  const isFocused = useIsFocused();

  useEffect(()=>{
    if(isFocused){
      setImageData([])
    setShowPost(false)
    setContent(false)
    }
  },[isFocused])

  const addData = () => {
    const formData = new FormData();
    formData.append('content', content);

    if (imageData.length) {
      imageData.map((item) =>
         item.mime === 'video/mp4' ? 
        formData.append('video', {
          uri: item.path,
          type: item.mime,
          name: item.path,
        })
        :
        formData.append("image", {
          uri: item.path,
          type: item.mime,
          name: item.path,
        })
      );
    }
    props.AddPostData(formData)
  };

  const onChangePostImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'any',
      multiple: true,
    }).then(image => {
      let newArray = [];
      image.length &&
        image.map(item => {
          newArray.push(item);
        });
      setImageData(newArray);
    });
  };

  const {width} = Dimensions.get('window');

  const filterData = item => {
    let filterData = imageData.filter(v => v.path !== item.path);
    setImageData(filterData);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            height: 80,
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={closeIcon} style={{height: 14, width: 14}} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 30,
              fontSize: 16,
              fontWeight: '700',
              color: 'black',
            }}
          >
            Write Post
          </Text>
        </View>
        {showPost ? (
          <TextInput
            onChangeText={value => setContent(value)}
            autoFocus={true}
            style={{color: 'black', paddingHorizontal: 30}}
          />
        ) : (
          <TouchableOpacity
            style={{marginTop: 30, alignItems: 'center'}}
            onPress={() => setShowPost(true)}
          >
            <Text style={{fontSize: 16, color: 'gray'}}>Tap to Create a Post</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={imageData && imageData}
          numColumns="2"
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <>
              <View style={{marginTop: 20, alignItems: 'center', width: '50%'}}>
                <Image
                  style={{
                    height: (173 / 375) * width,
                    width: (145 / 375) * width,
                    borderRadius: 15,
                  }}
                  source={{uri: item.path}}
                />
                <TouchableOpacity
                  onPress={() => filterData(item)}
                  style={{position: 'absolute', right: 30, top: 8}}
                >
                  <Image style={{height: 20, width: 20}} source={circleClose} />
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </ScrollView>
      <View
        style={{
          borderTopColor: 'black',
          borderTopWidth: 1,
          height: 60,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity onPress={() => onChangePostImage()}>
          <Image source={colorAddIcon} style={{height: 31, width: 31}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => content && imageData.length && addData()}
          style={{
            height: 44,
            width: 81,
            borderRadius: 10,
            backgroundColor: content && imageData.length ? '#4194cb' : 'gray',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
            }}
          >
          {props.requesting ? <ActivityIndicator size="small" color="#000" /> : "Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22,
  },
});

const mapStateToProps = state => ({
  requesting: state.addPostReducer.requesting,
});

const mapDispatchToProps = dispatch => ({
  AddPostData: data => dispatch(AddPostData(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
