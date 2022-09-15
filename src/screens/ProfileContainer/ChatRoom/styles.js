import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    backgroundColor: '#128C7E',
    flex: 1,
  },
  sectionTitleView: {
    flexDirection: 'row',
    marginTop: 18,
    marginLeft: 18,
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  countView: {
    marginLeft: 8,
    width: 25,
    height: 25,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  newMatchesListView: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 8,
  },
  messagesListView: {
    height: '100%',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 8,
  },
  swipeToDeleteView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  swipeToDeleteButton: {
    // height: 50,
    alignItems: 'center',
  },
  swipeToDeleteButtonText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  mainLoader: {
    position: 'absolute',
    alignSelf: 'center',
    top: 240,
  },
});
