import create from "zustand"
import RNFS from "react-native-fs"
import moment from "moment"

export const createDirectChannel = (pubnub, userId, chatWithId, customData) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const channel = `${userId > chatWithId ? userId : chatWithId}-${
        chatWithId < userId ? chatWithId : userId
      }`

      // Set channel metadata
      await pubnub.objects.setChannelMetadata({
        channel,
        data: customData
      })

      // Set channel members
      pubnub.time().then(
        async item =>
          await pubnub.objects.setChannelMembers({
            channel,
            uuids: [
              {
                id: `${userId}`,
                custom: { lastReadTimetoken: item?.timetoken }
              },
              {
                id: `${chatWithId}`,
                custom: { lastReadTimetoken: item?.timetoken }
              }
            ]
          })
      )

      //  Add channel to channel group
      // await pubnub.channelGroups.addChannels({
      //   channels: [channel],
      //   channelGroup: userId
      // })

      resolve({ channel: channel })
    } catch (error) {
      reject(error)
    }
  })
}

const user = {
  name: "Mark Kelley",
  id: "user_a00001",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg"
}

export const users = [
  {
    name: "Anna Gordon",
    id: "user_a00002",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "Luis Griffin",
    id: "user_a00003",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "Sue Flores",
    id: "user_a00004",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  }
]

export const uuid = user._id
export const ChannelType = {
  Direct: 0,
  Group: 1
}

export const useStore = create(setState => ({
  state: {
    channels: {},
    messages: {},
    members: {},
    contacts: [user, ...users],
    user
  },
  dispatch: newState =>
    setState(oldState => ({ state: { ...oldState.state, ...newState } }))
}))

export const cloneArray = data => {
  return JSON.parse(JSON.stringify(data))
}

export const setChannelMetadata = (pubnub, channelId, data) => {
  return pubnub.objects.setChannelMetadata({
    channel: channelId,
    data: data
  })
}

export const fetchChannels = (pubnub, userId) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const channels = {}
    const metadata = await pubnub.objects.getAllChannelMetadata({
      filter: `id LIKE "*${userId}*"`,
      include: { customFields: true }
    })

    metadata.data.forEach(({ id, name, updated, custom }) => {
      channels[id] = {
        id,
        name,
        updated,
        custom: { ...channels[id]?.custom, ...custom }
      }
    })
    resolve(channels)
  })
}

export const fetchAndAddTimeTokens = async (data, pubnub) => {
  const updatedData = {} // Initialize an empty object to store the updated data
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const item = data[key]
      try {
        const response = await new Promise((resolve, reject) => {
          pubnub.fetchMessages(
            {
              channels: [item.id],
              count: 1
            },
            (_, response) => {
              if (response?.channels[item.id]) {
                resolve(response.channels[item.id][0].timetoken)
              } else {
                reject("Error fetching messages")
              }
            }
          )
        })
        const updatedItem = { ...item, timeToken: response }
        updatedData[key] = updatedItem
      } catch (error) {}
    }
  }
  return updatedData
}

export const timeSince = date => {
  const seconds = Math.floor((new Date() - date) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) {
    return Math.floor(interval) + " years"
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " months"
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " days"
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " hours"
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minutes"
  }
  return Math.floor(seconds) + " seconds"
}

export const removeDuplication = arr => {
  return arr.filter((v, i, a) => a.findIndex(v2 => v2._id === v._id) === i)
}

export const sortArray = arr => {
  const newData = removeDuplication(arr)
  return newData
    .sort((a, b) => {
      const keyA = new Date(a.createdAt)
      const keyB = new Date(b.createdAt)
      // Compare the 2 dates
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })
    .reverse()
}

export function getByValue(arr, value) {
  const result = arr.find(function (o) {
    return o.id === value
  })
  return result
}

export const getUrl = async (uri, fileName) => {
  const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`
  await RNFS.copyFile(uri, destPath)
  await RNFS.stat(destPath)
  return destPath
}

export const loadHistory = data => {
  return data.map(obj => {
    if ("file" in obj) {
      const message = {
        _id: obj.file.id,
        [obj.message.type]: obj.file.name,
        createdAt: obj.message.createdAt,
        user: obj.message.user
      }
      return message
    } else {
      return obj
    }
  })
}

export const listener = (state, dispatch) => ({
  message: payload => {
    // channel, subscription, timetoken, message, publisher
    const channelMessages = state.messages[payload.channel] || []
    state.messages[payload.channel] = [...channelMessages, payload.message]
    dispatch({ messages: state.messages })
  },
  file: envelop => {
    const channelMessages = state.messages[envelop.channel] || []
    state.messages[envelop.channel] = [
      ...channelMessages,
      {
        _id: envelop.file.id,
        name: envelop.file.name,
        [envelop.message.type]: envelop.file.url,
        createdAt: new Date((envelop.timetoken / 10000000) * 1000),
        user: state.user
      }
    ]
    dispatch({ messages: state.messages })
  },
  presence: event => {
    // action, channel, occupancy, state
    if (event.channel in state.channels) {
      state.channels[event.channel].last_seen = event?.state?.last_seen
      dispatch({ channels: state.channels })
    }
  },
  signal: signal => {},
  objects: objectEvent => {},
  messageAction: messageAction => {},
  status: status => {
    dispatch({ status })
  }
})

export const makeChannelsList = list => {
  const updatedChannels = Object.values(list)

  updatedChannels.sort((a, b) => {
    const timeTokenA = parseInt(a.timeToken || 0)
    const timeTokenB = parseInt(b.timeToken || 0)

    if (isNaN(timeTokenA)) return 1
    if (isNaN(timeTokenB)) return -1

    return timeTokenB - timeTokenA
  })

  const DATA = [
    {
      title: "Direct Chats",
      data: updatedChannels
        .filter(item => {
          return item.custom.type === 0
        })
        .map(obj => ({ ...obj }))
    }
  ]

  return DATA
}

export const removePubnubChannel = (pubnub, userId, channelId) => {
  return Promise.all([
    pubnub.objects.removeChannelMetadata({ channel: channelId }),
    pubnub.channelGroups.removeChannels({
      channelGroup: userId,
      channels: [channelId]
    })
  ])
}

export const leavePubnubChannel = (pubnub, userId, channelId) => {
  return Promise.all([
    pubnub.objects.removeChannelMembers({
      channel: channelId,
      uuids: [userId]
    }),
    pubnub.channelGroups.removeChannels({
      channelGroup: userId,
      channels: [channelId]
    }),
    pubnub.objects.removeChannelMetadata({
      channel: channelId
    })
  ])
}

export const sendMessages = (pubnub, channelId, message) => {
  return new Promise((resolve, reject) => {
    pubnub.publish(
      { channel: channelId, message: message },
      (status, response) => {
        resolve({ status, response })
      }
    )
  })
}

export const pubnubTimeTokenToDatetime = timestamp => {
  var momentObj = moment(timestamp)
  var formattedDateTime = momentObj.format("MMM D h:mm a")

  return formattedDateTime
}

export const messageTimeTokene = timestamp => {
  var timeDate = new Date((timestamp / 10000000) * 1000)
  var momentObj = moment(timeDate)
  var formattedDateTime = ""

  if (momentObj.isSame(moment(), "day")) {
    formattedDateTime = momentObj.format("h:mm A")
  } else if (momentObj.isSame(moment().subtract(1, "days"), "day")) {
    formattedDateTime = "Yesterday"
  } else {
    formattedDateTime = momentObj.format("MMM D, YYYY h:mm A")
  }

  return formattedDateTime
}

export const getPubNubTimetoken = () => {
  const now = Math.floor(Date.now() / 1000)
  const currentDate = new Date(now * 1000)
  const timetoken = currentDate.getTime() * 10000
  return timetoken
}
