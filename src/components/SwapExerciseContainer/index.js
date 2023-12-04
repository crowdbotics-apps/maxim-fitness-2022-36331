import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SwapExerciseContainer from './SwapExerciseContainer';
import {
  getAllSessionRequest,
  swapExercises,
  allSwapExercise,
  saveSwipeDateAction,
} from '../../ScreenRedux/programServices';

const mapState = state => ({
  // exercisesObj: state.sessions && state.sessions.exercisesObj,
  selectedSession: state.programReducer && state.programReducer.selectedSession,
  allExercises: state.sessions && state.programReducer.selectedSession,
  // exerciseSwapped: state.sessions && state.sessions.exerciseSwapped,
  // selectedSwapObj: state.sessions && state.sessions.selectedSwapObj,
  // allExerciseSwapped: state.sessions && state.sessions.allExerciseSwapped,
});

const mainActions = {
  getAllExercisesAction: getAllSessionRequest,
  swapExercisesAction: swapExercises,
  getAllSwapExercise: allSwapExercise,
  saveSwipeDateAction: saveSwipeDateAction,
};

const mapActions = dispatch => bindActionCreators(mainActions, dispatch);

export default connect(mapState, mapActions)(SwapExerciseContainer);
