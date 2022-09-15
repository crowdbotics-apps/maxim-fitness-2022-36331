import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
const store = firestore();

export default class Database {
  static database = null

  static shared() {
    if (Database.database == null) {
      Database.database = new Database();
    }
    return this.database;
  }

  init = userID => {
    this.userID = userID;
  }

  dbRef() {
    return store.collection(`users/${this.userID}/chats`);
  }

  async addChat(id) {
    const data = {
      id,
      createdAt: moment.now(),
      count: 0,
      messages: [],
    };
    this.dbRef.add(data);
  }

  async getChatList() {
    const snapshot = await this.dbRef().orderBy('timestamp').get();
    const chats = [];
    for (let index = 0; index < snapshot.docs.length; index++) {
      try {
        const docSS = snapshot.docs[index];
        const chat = {
          chatID: docSS.id,
          detail: docSS.data(),
        };
        chats.push(chat);
      } catch (err) {
        err;
      }
    }
    return chats;
  }

  subscribe = callback => {
    this.unSub = this.dbRef().onSnapshot(() => callback());
  }

  off() {
    this.unSub();
  }
}
