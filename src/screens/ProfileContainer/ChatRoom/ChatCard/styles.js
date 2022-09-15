import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 4,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: 'white',
  },
  imageView: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  messageView: {
    flex: 0.3,
  },
  nameText: {
    marginTop: 10,
    marginRight: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'green',
  },
  messageText: {
    marginTop: 8,
    marginRight: 8,
    fontWeight: '500',
    fontSize: 13,
  },
  photoView: {
    flex: 1,
    flexDirection: 'row',
  },
  photoText: {
    marginLeft: 10,
  },
  timestampView: {
    flex: 0.2,
    alignItems: 'center',
  },
  timestampText: {
    marginTop: 13,
    fontWeight: 'bold',
    fontSize: 12,
    color: 'gray',
  },
  countView: {
    marginTop: 16,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
