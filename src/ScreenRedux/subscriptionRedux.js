import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

// config
import { API_URL } from "../config/app"
import { setAccessToken } from "./loginRedux"
import { navigate } from "../navigation/NavigationService"
import { showMessage } from "react-native-flash-message"

// utils
import XHR from "src/utils/XHR"
import { getAllSessionRequest } from "./programServices"

//Types
const GET_PLAN_REQUEST = "SUBSCRIPTION_SCREEN/GET_PLAN_REQUEST"
const GET_PLAN_SUCCESS = "SUBSCRIPTION_SCREEN/GET_PLAN_SUCCESS"
const GET_PLAN_FAILURE = "SUBSCRIPTION_SCREEN/GET_PLAN_FAILURE"
const NEW_SUBSCRIPTION = "SUBSCRIPTION_SCREEN/NEW_SUBSCRIPTION"
const RESET = "SUBSCRIPTION_SCREEN/RESET"

const GET_CUSTOMERID_REQUEST = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_REQUEST"
const GET_CUSTOMERID_SUCCESS = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_SUCCESS"
const GET_CUSTOMERID_FAILURE = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_FAILURE"

const POST_SUBSCRIPTION_REQUEST =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_REQUEST"
const POST_SUBSCRIPTION_SUCCESS =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_SUCCESS"
const POST_SUBSCRIPTION_FAILURE =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_FAILURE"
const PAYMENT_SUBSCRIPTION_REQUEST =
  "SUBSCRIPTION_SCREEN/PAYMENT_SUBSCRIPTION_REQUEST"
const UPDATE_CUSTOMER_SOURCE =
  "SUBSCRIPTION_SCREEN/UPDATE_CUSTOMER_SOURCE"

const GET_CARD_REQUEST =
  "SUBSCRIPTION_SCREEN/GET_CARD_REQUEST"
const DELETE_CARD_REQUEST =
  "SUBSCRIPTION_SCREEN/DELETE_CARD_REQUEST"
const DELETE_CARD_REQUEST_SUCCESS =
  "SUBSCRIPTION_SCREEN/DELETE_CARD_REQUEST_SUCCESS"

const GET_CARD_REQUEST_SUCCESS = "SUBSCRIPTION_SCREEN/GET_CARD_REQUEST_SUCCESS"
const SET_CARD_DATA = "SUBSCRIPTION_SCREEN/SET_CARD_DATA"
const GET_SUBSCRIPTION_ID_REQUEST = "SUBSCRIPTION_SCREEN/GET_SUBSCRIPTION_ID_REQUEST"
const GET_SUBSCRIPTION_ID_SUCCESS = "SUBSCRIPTION_SCREEN/GET_SUBSCRIPTION_ID_SUCCESS"
const SUBSCRIPTION_CANCELATION_REQUEST = "SUBSCRIPTION_SCREEN/SUBSCRIPTION_CANCELATION_REQUEST"
const SUBSCRIPTION_CANCELATION_SUCCESS = "SUBSCRIPTION_SCREEN/SUBSCRIPTION_CANCELATION_SUCCESS"
const SUBMIT_QUESTION = "SUBSCRIPTION_SCREEN/SUBMIT_QUESTION"


const initialState = {
  requesting: false,
  getPlanSuccess: false,
  getPlanFailure: false,

  cIRequesting: false,
  getCISuccess: false,
  getCIFailure: false,

  SRequesting: false,
  getSubscription: false,
  getSubscriptionError: false,
  subscriptionData: false,
  subRequesting: false,
  getCardData: false,
  cardRequesting: false,
  cardPlanData: {},
  subscriptionIdData: false,
  subIdRequesting: false,
  cardAddRequesting: false,
  cardDeleteRequesting: false,
  cardPayRequesting: false,
  cancelRequesting: false
}

//Actions
export const getPlanRequest = data => ({
  type: GET_PLAN_REQUEST,
  data
})
export const setPlanCardData = data => ({
  type: SET_CARD_DATA,
  data
})
export const getPlanSuccess = data => ({
  type: GET_PLAN_SUCCESS,
  data
})

export const getPlanFailure = error => ({
  type: GET_PLAN_FAILURE,
  error
})

export const getCustomerIdRequest = data => ({
  type: GET_CUSTOMERID_REQUEST,
  data
})

export const getCustomerIdSuccess = data => ({
  type: GET_CUSTOMERID_SUCCESS,
  data
})

export const getCustomerIdFailure = error => ({
  type: GET_CUSTOMERID_FAILURE,
  error
})

export const postSubscriptionRequest = data => ({
  type: POST_SUBSCRIPTION_REQUEST,
  data
})

export const postSubscriptionSuccess = data => ({
  type: POST_SUBSCRIPTION_SUCCESS,
  data
})

export const postSubscriptionFailure = error => ({
  type: POST_SUBSCRIPTION_FAILURE,
  error
})

export const newSubScription = data => ({
  type: NEW_SUBSCRIPTION,
  data
})

export const paymentSubscriptionRequest = data => ({
  type: PAYMENT_SUBSCRIPTION_REQUEST,
  data
})
export const updateCustomerSource = data => ({
  type: UPDATE_CUSTOMER_SOURCE,
  data
})

export const getCardRequest = data => ({
  type: GET_CARD_REQUEST,
  data
})
export const getCardRequestSuccess = data => ({
  type: GET_CARD_REQUEST_SUCCESS,
  data
})
export const deleteCardRequest = data => ({
  type: DELETE_CARD_REQUEST,
  data
})
export const deleteCardSuccess = data => ({
  type: DELETE_CARD_REQUEST_SUCCESS,
  data
})


export const reset = () => ({
  type: RESET
})
export const getSubscriptIdRequest = data => ({
  type: GET_SUBSCRIPTION_ID_REQUEST,
  data
})
export const getSubscriptIdSuccess = data => ({
  type: GET_SUBSCRIPTION_ID_SUCCESS,
  data
})
export const subscriptionCancelation = data => ({
  type: SUBSCRIPTION_CANCELATION_REQUEST,
  data
})

export const subscriptionCancelationSuccess = data => ({
  type: SUBSCRIPTION_CANCELATION_SUCCESS,
  data
})
export const submitQuestion = data => ({
  type: SUBMIT_QUESTION,
  data
})




//Reducers
export const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_SUBSCRIPTION_ID_REQUEST:
      return {
        ...state,
        subIdRequesting: true
      }
    case GET_SUBSCRIPTION_ID_SUCCESS:
      return {
        ...state,
        subscriptionIdData: action.data
      }

    case GET_PLAN_REQUEST:
      return {
        ...state,
        subRequesting: true
      }


    case DELETE_CARD_REQUEST:
      return {
        ...state,
        cardDeleteRequesting: true
      }
    case DELETE_CARD_REQUEST_SUCCESS:
      return {
        ...state,
        cardDeleteRequesting: false
      }
    case GET_PLAN_SUCCESS:
      return {
        ...state,
        getPlanSuccess: action.data,
        subRequesting: false
      }
    case GET_PLAN_FAILURE:
      return {
        ...state,
        getPlanFailure: action.error,
        subRequesting: false
      }
    case SET_CARD_DATA:
      return {
        ...state,
        cardPlanData: action.data
      }
    case GET_CUSTOMERID_REQUEST:
      return {
        ...state,
        requesting: true
      }
    case GET_CARD_REQUEST:
      return {
        ...state,
        cardRequesting: true
      }

    case GET_CARD_REQUEST_SUCCESS:
      return {
        ...state,
        getCardData: action.data,
        cardAddRequesting: false
      }


    case GET_CUSTOMERID_SUCCESS:
      return {
        ...state,
        getCISuccess: action.data,
        requesting: false
      }
    case GET_CUSTOMERID_FAILURE:
      return {
        ...state,
        getCIFailure: action.error,
        requesting: false
      }

    case POST_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        cardAddRequesting: true
      }


    case UPDATE_CUSTOMER_SOURCE:
      return {
        ...state,
        cardPayRequesting: true
      }
    case PAYMENT_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        cardPayRequesting: true
      }

    case POST_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        getSubscription: action.data,
        requesting: false,
        cardPayRequesting: false
      }
    case POST_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        getSubscriptionError: action.error,
        requesting: false
      }

    case NEW_SUBSCRIPTION:
      return {
        ...state,
        subscriptionData: action.data
      }
    case SUBSCRIPTION_CANCELATION_REQUEST:
      return {
        ...state,
        cancelRequesting: true
      }
    case SUBSCRIPTION_CANCELATION_SUCCESS:
      return {
        ...state,
        cancelRequesting: false
      }


    case RESET:
      return {
        ...state,
        requesting: false,
        subIdRequesting: false,
        cardAddRequesting: false,
        cardDeleteRequesting: false,
        cardPayRequesting: false,
        cancelRequesting: false
      }

    default:
      return state
  }
}

//Saga
async function getPlanAPI() {
  const URL = `${API_URL}/subscription/plans/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }
  return XHR(URL, options)
}

function* getFeeds() {
  try {
    const response = yield call(getPlanAPI)
    const activeFilteredData = response.data.filter(
      data => data.product_details.active
    )
    yield put(getPlanSuccess(activeFilteredData))
  } catch (e) {
    const { response } = e
    yield put(getPlanFailure(e))
  } finally {
    yield put(getPlanFailure())
  }
}

//Saga
async function getCustomerIdAPI() {
  const URL = `${API_URL}/payment/get_customer_id/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }
  return XHR(URL, options)
}

function* getCustomerId() {
  try {
    const response = yield call(getCustomerIdAPI)

    yield put(getCustomerIdSuccess(response.data.data))
  } catch (e) {
    const { response } = e

    yield put(getCustomerIdFailure(e))
  }
}

//Saga

async function addSubscriptionCardAPI(data) {
  const URL = `${API_URL}/subscription/create_card/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }
  return XHR(URL, options)
}
function* addSubscriptionCard({ data }) {
  try {
    const response = yield call(addSubscriptionCardAPI, data)
    yield put(getCardRequest())
    postSubscriptionSuccess(response.data)
    showMessage({
      message: "Card added successfully",
      type: "success"
    })
  } catch (e) {
    showMessage({
      message: e?.response?.data?.error || "something went wrong",
      type: "danger"
    })
    const { response } = e
  } finally {
    yield put(reset())
  }
}
//api call function
async function paymentSubscriptionAPI(payload) {
  const data = {
    price_id: payload.plan_id,
    premium_user: true,
    platform: payload?.platform,
    transactionId: payload?.transactionId
  }

  const URL = `${API_URL}/subscription/create_subscription/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }
  return XHR(URL, options)
}

//generator function
function* paymentSubscription({ data }) {

  try {
    const response = yield call(paymentSubscriptionAPI, data)
    if (data?.profile.is_survey && response?.data?.is_premium_user) {
      Promise.all(
        yield put(submitQuestion())).then(() => {
          setTimeout(() => {
            if (data?.profile.is_survey) { navigate("BottomBar") }

          }, 5000)
        })

    }
    // if (!data?.profile.is_survey) { navigate("Birthday") }
    yield put(postSubscriptionSuccess(response.data))
    showMessage({
      message: "Bought subscription successfully",
      type: "success"
    })
  } catch (e) {
    showMessage({
      message: e?.response?.data || "something went wrong",
      type: "danger"
    })
    const { response } = e
  } finally {
    // yield put(getAllSessionRequest(''))
    yield put(reset())
  }
}
// <============================start card apis=====get==========>

async function getCardDataApi(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/subscription/my_cards/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET"
  }
  return XHR(URL, options)
}
//generator function
function* getCardsData({ data }) {
  try {
    const response = yield call(getCardDataApi, data)
    yield put(getCardRequestSuccess(response.data))
  } catch (e) {
    yield put(getCardRequestSuccess([]))
    const { response } = e
  } finally {
    yield put(reset())
  }
}
// <============================end card apis========get=======>

// <============================start card apis===delete===========>

//assign CSV programs
async function deleteCardApi(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/subscription/delete_card/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data
  }
  return XHR(URL, options)
}
//generator function
function* deleteCard({ data }) {
  try {
    const response = yield call(deleteCardApi, data)
    yield put(deleteCardSuccess(response?.data))
    showMessage({
      message: "Card deleted successfully",
      type: "success"
    })
  } catch (e) {
    yield put(getCardRequestSuccess([]))
    showMessage({
      message: e?.response?.data?.detail || "Something went wrong",
      type: "danger"
    })
    const { response } = e
  } finally {
    yield put(getCardRequest())
    yield put(reset())
  }
}
// <============================end card apis===delete============>



// <============================start get subscription apis===get===========>


async function subscriptionIdApi(data) {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/subscription/active_subscriptions/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "GET",
    data
  }
  return XHR(URL, options)
}
//generator function
function* getSubscriptionId({ data }) {
  try {
    const response = yield call(subscriptionIdApi, data)
    yield put(getSubscriptIdSuccess(...response.data))
  } catch (e) {
    yield put(getSubscriptIdSuccess(false))
    const { response } = e
  } finally {
    yield put(reset())
  }
}
// <=======================end====get subscription apis== ===get============>

// <============================start cancel subscription apis==============>


async function subscriptionCancelationApi(data) {
  const payload = { subscription_id: data }
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/subscription/cancel_subscription/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST",
    data
  }
  return XHR(URL, options)
}
//generator function
function* subscriptionCancelationRequest({ data }) {
  try {
    const response = yield call(subscriptionCancelationApi, data)
    showMessage({
      message: data?.reactivate_subscription ? "Subscription reactivated successfully" : 'Subscription cancelled successfully',
      type: "success"
    })
    yield put(subscriptionCancelationSuccess(response.data))
    navigate("BottomBar")
  } catch (e) {
    showMessage({
      message: "something went wrong",
      type: "danger"
    })
    const { response } = e
  } finally {
    yield put(reset())
  }
}
// <===================end========cancel subscription apis== ===============>


async function submitQuestionAPI() {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/form/set_program/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST"
  }
  return XHR(URL, options)
}
function* submitQuestionFunc() {
  try {
    const response = yield call(submitQuestionAPI)

  } catch (e) {

    const { response } = e
  } finally {
    yield put(reset())
  }
}




//api call function for update source
async function updateSourceApi(params) {
  const data = { payment_method_id: params?.payment_method_id }
  const URL = `${API_URL}/subscription/update_customer_source/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    method: "POST",
    data
  }
  return XHR(URL, options)
}

function* updateCustomerSourceRequest({ data }) {
  try {
    const response = yield call(updateSourceApi, data)
    yield put(paymentSubscriptionRequest(data))
  } catch (e) {
    showMessage({
      message: "something went wrong",
      type: "danger"
    })
    const { response } = e
  } finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(GET_PLAN_REQUEST, getFeeds),
  takeLatest(GET_CUSTOMERID_REQUEST, getCustomerId),
  takeLatest(POST_SUBSCRIPTION_REQUEST, addSubscriptionCard),
  takeLatest(PAYMENT_SUBSCRIPTION_REQUEST, paymentSubscription),
  takeLatest(UPDATE_CUSTOMER_SOURCE, updateCustomerSourceRequest),
  takeLatest(GET_CARD_REQUEST, getCardsData),
  takeLatest(DELETE_CARD_REQUEST, deleteCard),
  takeLatest(GET_SUBSCRIPTION_ID_REQUEST, getSubscriptionId),
  takeLatest(SUBSCRIPTION_CANCELATION_REQUEST, subscriptionCancelationRequest),
  takeLatest(SUBMIT_QUESTION, submitQuestionFunc)





])

