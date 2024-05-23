import React, { useEffect, useState } from "react"
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
  Platform
} from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import { createThumbnail } from "react-native-create-thumbnail"
import { Images } from "src/theme"
import { connect } from "react-redux"
import { showMessage } from "react-native-flash-message"

//action
import { AddPostData, reset } from "../../ScreenRedux/addPostRequest"
import { useIsFocused } from "@react-navigation/native"

const { closeIcon, colorAddIcon, circleClose } = Images

const { width } = Dimensions.get("window")
const AddPost = props => {
  const { navigation, AddPostData } = props

  const [showPost, setShowPost] = useState(false)
  const [imageData, setImageData] = useState([])
  const [content, setContent] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setImageData([])
      setShowPost(false)
      setContent(false)
    }
  }, [isFocused])

  const aa = () => {
    let formData = new FormData()
    formData.append("content", content)
    const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm"]
    // formData.append('video_thumbnail', {
    //   uri: videoThumbnail.path,
    //   type: videoThumbnail.mime,
    //   name: videoThumbnail.path,
    // });
    imageData.map((item, index) => {
      const fileExtension = item?.uri?.split(".").pop().toLowerCase()
      if (
        item?.type.startsWith("video/") &&
        videoExtensions.includes(fileExtension)
      ) {
        formData.append("video", {
          uri: item.uri,
          type: item.type,
          name: item.uri
        })
      } else {
        formData.append("image", {
          uri: item.uri,
          type: item.type,
          name: item.uri
        })
      }
    })
    return formData
  }

  const addData = () => {
    props.AddPostData(aa())
  }
  const checkFileType = item => {
    if (item?.type.startsWith("video/")) {
      return true
    } else {
      return false
    }
  }

  const onChangePostImage = () => {
    if (imageData?.length < 5) {
      launchImageLibrary({
        // width: 300,
        // height: 400,
        mediaType: "any",
        multiple: true,
        selectionLimit: 5,

        compressVideoPreset: "Passthrough"
      }).then(data => {
        const image = data.assets
        image.length &&
          image?.slice(0, 5 - imageData?.length).forEach(item => {
            if (item.fileSize > 60 * 1024 * 1024) {
              showMessage({
                message: "File size can't be greater then 60MBs",
                type: "danger"
              })
            } else {
              if (checkFileType(item) && Platform.OS === "ios") {
                createThumbnail({
                  url: item.uri,
                  timeStamp: 10000
                })
                  .then(response => {
                    const thumbnail = item.uri
                    item["thumbnail"] = thumbnail
                    setImageData(previous => [...previous, item])
                  })
                  .catch(err => { })
              } else {
                setImageData(previous => [...previous, item])
              }
            }
          })
      })
    }
  }

  const filterData = item => {
    let filterData = imageData.filter(v => v.uri !== item.uri)
    setImageData(filterData)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            height: 80,
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.reset()
              navigation.goBack()
            }}
          >
            <Image source={closeIcon} style={{ height: 14, width: 14 }} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 30,
              fontSize: 16,
              fontWeight: "700",
              color: "black"
            }}
          >
            Write Post
          </Text>
        </View>
        {showPost ? (
          <TextInput
            onChangeText={value => setContent(value)}
            autoFocus={true}
            style={{
              color: "black",
              paddingHorizontal: 30,
              paddingVertical: 10
            }}
            placeholder="Enter post title"
            placeholderTextColor="#525252"
            multiline={true}
          />
        ) : (
          <TouchableOpacity
            style={{ marginTop: 30, alignItems: "center" }}
            onPress={() => setShowPost(true)}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              Tap to Create a Post
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={imageData && imageData}
          numColumns="2"
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <>
              <View
                style={{ marginTop: 20, alignItems: "center", width: "50%" }}
              >
                <Image
                  style={{
                    height: (173 / 375) * width,
                    width: (145 / 375) * width,
                    borderRadius: 15
                  }}
                  source={{
                    uri: item?.thumbnail ? item?.thumbnail : item.uri
                  }}
                />

                <TouchableOpacity
                  onPress={() => filterData(item)}
                  style={{
                    position: "absolute",
                    right: 30,
                    top: 8,
                    padding: 5
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20 }}
                    source={circleClose}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </ScrollView>
      <View
        style={{
          borderTopColor: "black",
          borderTopWidth: 1,
          height: 60,
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row"
        }}
      >
        <TouchableOpacity onPress={() => onChangePostImage()}>
          <Image source={colorAddIcon} style={{ height: 31, width: 31 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => content && imageData.length && addData()}
          style={{
            height: 44,
            width: 81,
            borderRadius: 10,
            backgroundColor: content && imageData.length ? "#4194cb" : "gray",
            justifyContent: "center"
          }}
        >
          {props?.requesting ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "white",
                textAlign: "center"
              }}
            >
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  backIconStyle: {
    height: 16,
    width: 8,
    marginTop: 46,
    marginLeft: 22
  },
  playicon: {
    height: 50,
    width: 50,
    position: "absolute",
    tintColor: "white",
    top: (60 / 375) * width,
    left: (50 / 375) * width
  }
})

const mapStateToProps = state => ({
  requesting: state.addPostReducer.requesting
})

const mapDispatchToProps = dispatch => ({
  AddPostData: data => dispatch(AddPostData(data)),
  reset: () => dispatch(reset())
})
export default connect(mapStateToProps, mapDispatchToProps)(AddPost)
