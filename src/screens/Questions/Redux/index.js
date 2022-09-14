const UPDATE_ANSWERS = 'Questions/redux/UPDATE_ANSWERS';

export const updateAnswer = data => ({
  type: UPDATE_ANSWERS,
  data,
});

const initialState = {
  answers: {},
};

//Reducers
export const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ANSWERS:
      return {
        ...state,
        answers: action.data,
      };

    default:
      return state;
  }
};
