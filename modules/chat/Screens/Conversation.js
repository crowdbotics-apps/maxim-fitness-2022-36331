import React, { useEffect, useState, useCallback } from 'react';
import { Images } from 'src/theme';
import { useStore, ChannelType } from '../Store';

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  SectionList,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
// @ts-ignore
import { usePubNub } from 'pubnub-react';
import { fetchChannels, getByValue, makeChannelsList, timeSince } from '../utils';
import Circle from '../Components/Circle';
import SearchBar from '../Components/SearchBar';
// @ts-ignore
import { useFocusEffect } from '@react-navigation/native';
import { createDirectChannel } from '../utils';

const Conversations = ({ navigation }) => {
  const pubnub = usePubNub();
  const { state, dispatch } = useStore();
  const [loading, setLoading] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const [search, setSearch] = useState('');
  const { width } = Dimensions.get('window');
  const { profile, messageImage, backImage, searchImage } = Images;
  const chatData = useSelector(state => state.userProfileReducer.chatUserData);
  const userDetail = useSelector(state => state.login.userDetail);
  

  let apidata = {
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    name:  chatData?.user_detail?.username,
    _id:   chatData?.user_detail?.id,
  };

  const createChat = async item => {
    const res = await createDirectChannel(pubnub, userDetail.id, item._id, {
      name: userDetail.username + ' - ' + item.name,
      custom: { type: 0, owner: userDetail.id },
    });
    dispatch({
      channels: {
        ...state.channels,
        [res.channel]: {
          id: res.channel,
          name: userDetail.username + ' - ' + item.name,
          custom: { type: ChannelType.Direct, owner: userDetail.id },
        },
      },
    });
    setLoading(false);
    navigation.replace('Channel', {
      item: {
        id: res.channel,
        name: state.user.name + ' - ' + item.name,
        custom: { type: ChannelType.Direct, owner: state.user._id },
      },
    });
  };

  const bootstrap = () => {
    setLoading(true);
    fetchChannels(pubnub, userDetail.id).then(channels => {
      dispatch({ channels });
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    bootstrap();
  }, []);

  useEffect(() => {
    const DATA = makeChannelsList(state.channels);
    setConversationList(DATA);
  }, [state.channels]);

  useEffect(() => {
    if (search !== '') {
      const channels = Object.entries(state.channels).map(([id, rest]) => ({
        id,
        ...rest,
      }));
      const filterChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(search.toLowerCase())
      );
      const DATA = makeChannelsList(filterChannels);
      setConversationList(DATA);
    } else {
      const DATA = makeChannelsList(state.channels);
      setConversationList(DATA);
    }
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      getLastSeen();
    }, [state.channels])
  );

  const getLastSeen = () => {
    if (Object.keys(state.channels).length > 0) {
      const channels = Object.entries(state.channels).map(([id, rest]) => ({
        id,
        ...rest,
      }));
      Object.keys(state.channels).forEach(channel => {
        pubnub.hereNow(
          {
            channels: [channel],
            includeUUIDs: true,
            includeState: true,
          },
          (status, response) => {
            const tmp = getByValue(channels, channel);
            if (tmp) {
              tmp.last_seen = response.channels[channel]?.occupants[0]?.state?.last_seen;
              const DATA = [
                {
                  title: '',
                  data: channels
                    .filter(item => {
                      return item.custom.type === 1;
                    })
                    .map(obj => ({ ...obj })),
                },
                {
                  title: '',
                  data: channels
                    .filter(item => {
                      return item.custom.type === 0;
                    })
                    .map(obj => ({ ...obj })),
                },
              ];
              setConversationList(DATA);
            }
          }
        );
      });
    }
  };

  const ListItem = item => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 25,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('Channel', { item: item })}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={profile}
            style={{
              height: (61 / 375) * width,
              width: (61 / 375) * width,
              borderRadius: (31 / 375) * width,
            }}
          />
          <View style={{ justifyContent: 'center', marginLeft: 15 }}>
            <Text style={{ fontSize: 12 }}>{item?.name && item.name.toUpperCase()}</Text>
            <Text style={{ color: '#D3D3D3', fontSize: 12 }}> {item.custom.owner} </Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text text="2 days" style={{ color: '#D3D3D3', fontSize: 12 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.Container}>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.goBack()}>
          <Image source={backImage} style={{ height: 20, width: 30 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22 }}>Messages</Text>
        <TouchableOpacity onPress={() => createChat(apidata)}>
          <Image source={messageImage} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
      </View>
      {/* <SearchBar value={search} onChange={setSearch} /> */}
      <View style={{ paddingHorizontal: 20, marginTop: 30, flexDirection: 'row' }}>
        <TextInput
          style={{
            height: 40,
            borderRadius: 20,
            borderColor: '#D3D3D3',
            borderWidth: 1,
            paddingHorizontal: 60,
            width: '100%',
            position: 'relative',
          }}
          placeholder="Search People"
          onChangeText={setSearch}
        />
        <View
          style={{
            position: 'absolute',
            marginTop: 5,
            paddingLeft: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image source={searchImage} style={{ height: 30, width: 30 }} />
        </View>
      </View>
      <SectionList
        refreshing={loading}
        onRefresh={async () => {
          await bootstrap();
        }}
        sections={conversationList}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => ListItem(item)}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.ListContainer}>
            {/* <Text style={styles.GroupHeading}>{title}</Text> */}
            {title === 'Channels' ? (
              <Pressable onPress={() => navigation.navigate('CreateChannel')}>
                {/* <Text style={styles.GroupHeading}>Create group</Text> */}
              </Pressable>
            ) : (
              <Pressable onPress={() => navigation.navigate('CreateDirectChannel')}>
                {/* <Text style={styles.GroupHeading}>New chat</Text> */}
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    height: '100%',
    padding: 10,
  },
  TopProfileContainer: {
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  ProfileBox: {
    height: 42,
    width: 42,
    borderRadius: 50,
    backgroundColor: '#292B2F',
  },
  ProfileContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  ListItem: {
    backgroundColor: '#f0f3f7',
    padding: 8,
    marginBottom: 5,
  },
  Profile: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  ProfileText: {
    color: '#292B2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  GroupHeading: {
    color: '#292B2F',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  LastSeenText: {
    fontSize: 12,
    color: 'gray',
  },
  MT8: {
    marginTop: 8,
  },
  ListContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default Conversations;
