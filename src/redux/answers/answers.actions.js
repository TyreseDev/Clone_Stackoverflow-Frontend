import {
  GET_ANSWERS,
  ANSWER_ERROR,
  ADD_ANSWER,
  DELETE_ANSWER,
} from './answers.types';

import axios from 'axios';
import {setAlert} from '../alert/alert.actions';
import config from "../../config";

import censorBadWords from '../../services/censorBadWords'

export const getAnswers = (id) => async (dispatch) => {
  try {
    const res = await axios.get(config.BASE_URL + `/api/posts/answers/${id}`);

    dispatch({
      type: GET_ANSWERS,
      payload: res.data.data.map(({body, ...rest})=>({...censorBadWords({body}), ...rest})),
    });
  } catch (err) {
    dispatch({
      type: ANSWER_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};

// Add Answer
export const addAnswer = (postId, formData) => async (dispatch) => {
  const config_headers = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      config.BASE_URL + `/api/posts/answers/${postId}`,
      formData,
      config_headers
    );

    dispatch({
      type: ADD_ANSWER,
      payload: res.data.data,
    });

    dispatch(setAlert(res.data.message, 'success'));

    dispatch(getAnswers(postId));
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'danger'));

    dispatch({
      type: ANSWER_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};

// Delete Answer
export const deleteAnswer = (AnswerId) => async (dispatch) => {
  try {
    const res = await axios.delete(config.BASE_URL + `/api/posts/answers/${AnswerId}`);

    dispatch({
      type: DELETE_ANSWER,
      payload: AnswerId,
    });

    dispatch(setAlert(res.data.message, 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'danger'));

    dispatch({
      type: ANSWER_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};
