'use strict';

import { API_URL } from './config';
import { TIMEOUT_SEC } from './config.js';


const timeout = function(s) {
  return new Promise(function(_, reject) {
    setTimeout(function() {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const promiseFetchPost = uploadData
      ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      })
      : fetch(url);


    const response = await Promise.race([promiseFetchPost, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (errMsg) {
    throw errMsg;
  }
};

//note function above is combined from the two below for future reference

/*
export const getJSON = async function(url) {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data; //resolved value of the promise
  } catch (errMsg) {
    throw errMsg; // so we can get the error message in our model.js file -> re-throw the error so it gets caught in the model.js file's promise resolve
  }
};

export const sendJSON = async function(url, uploadData) {
  try {
    const postPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });

    const response = await Promise.race([postPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data; //resolved value of the promise
  } catch (errMsg) {
    throw errMsg; // so we can get the error message in our model.js file -> re-throw the error so it gets caught in the model.js file's promise resolve
  }
};

 */
