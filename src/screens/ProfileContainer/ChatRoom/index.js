import {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {unReadMsgAction} from '@/redux/modules/nutritionReducer';
import Database from './database';

const ChatRoom = props => {
  const {user, profile} = props;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUnReadChatsCount, setTotalUnReadChatsCount] = useState(0);
  useEffect(() => {
    props.unReadMsgAction(totalUnReadChatsCount);
    if (chats) {
      const chatCount = [...chats];
      let count = 0;
      chatCount.forEach(chat => {
        if (chat.detail.unReadMessagesCount > 0) {
          count += 1;
        }
      });
      setTotalUnReadChatsCount(count);
    }
  }, [chats]);

  const getConversations = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    const chat = await Database.shared().getChatList();
    setLoading(false);
    setChats(chat);
  };

  useEffect(() => {
    Database.shared().init(
      profile && profile.id,
      profile && profile.email ? profile.email : user && user.email
    );
    Database.shared().subscribe(() => {
      getConversations(false);
    });
    getConversations(false);
  }, []);

  return true;
};

const mapStateToProps = state => ({
  profile: state.auth && state.auth.profile,
});

const mapDispatchToProps = dispatch => ({
  unReadMsgAction: data => dispatch(unReadMsgAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
