import React, {useCallback, useRef, useState} from 'react'
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Video, {VideoRef} from 'react-native-video'
import {config} from './Styles'
import {ListVideos} from './ListVideos'

function App(): React.JSX.Element {
  //const videoRef = useRef<VideoRef>(null);
  const videoRef = useRef<any>({})
  const predecessorIndexVideo = useRef<number>(-1)

  const [currentIndexVideo, setCurrentIndexVideo] = useState<number>(0)

  const [listVideos, setListVideos] = useState<any>(ListVideos)

  // Unpause only the video currently being displayed in the Flatlist, and when scrolling, pause the current video, unpause the next video in the list, and pause all others.
  const onViewableItemsChanged = useCallback((viewableItems: any) => {
    if (predecessorIndexVideo.current >= 0 && videoRef.current[predecessorIndexVideo.current]) {
      videoRef.current[predecessorIndexVideo.current].seek(0)
    }
    setCurrentIndexVideo(viewableItems.changed[0].index)
    predecessorIndexVideo.current = viewableItems.changed[0].index
  }, [])

  // Control to manually pause the videos by clicking anywhere on the screen.
  const pauseVideoControl = (index: number) => {
    if (currentIndexVideo != -1) {
      setCurrentIndexVideo(-1)
      return
    }
    setCurrentIndexVideo(index)
  }

  const VideoComponent = ({item, index}: any) => (
    <TouchableOpacity onPress={() => pauseVideoControl(index)} activeOpacity={0.5}>
      <Video
        style={styles.backgroundVideo}
        source={{
          uri: item.url,
        }}
        poster={item.thumbnail}
        //ref={videoRef}
        ref={ref => (videoRef.current[index] = ref)}
        onError={err => console.log(index + ' - ' + JSON.stringify(err))}
        paused={currentIndexVideo == index ? false : true}
      />
      <Text style={{position: 'absolute', bottom: 0, marginLeft: 15}}>video {index}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <FlatList
        data={listVideos}
        style={{width: config.windowWidth, height: config.windowHeight, position: 'absolute'}}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        focusable
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        renderItem={VideoComponent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    //position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: config.windowWidth,
    height: config.windowHeight,
  },
})

export default App
