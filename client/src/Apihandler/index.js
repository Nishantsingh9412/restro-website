/** @format */

import axios from "axios";

export const serverUrl = import.meta.env.VITE_APP_BASE_URL_FOR_APIS;
// export const awsUrl = "https://maalikdesigners3.s3.eu-north-1.amazonaws.com/";

export const getApihandler = async (endPoint) => {
  try {
    const getres = await axios.get(serverUrl + endPoint);
    return getres.data;
  } catch (error) {
    return { error };
  }
};

export const getbyidApihandler = async (endPoint) => {
  try {
    const getres = await axios.get(serverUrl + endPoint);
    // console.log("getresbyid=>", getres);
    return getres.data;
  } catch (error) {
    return { error };
  }
};

export const postLoginApihandler = async (endPoint, value) => {
  try {
    const postRes = await axios.post(serverUrl + endPoint, value);
    // console.log("apipost=>", postRes);
    return postRes.data;
  } catch (error) {
    return { error };
  }
};

export const postApihandler = async (endPoint, value) => {
  // console.log("postvalue=>", endPoint);
  // console.log("postvalue=>", value);
  try {
    const postRes = await axios.post(serverUrl + endPoint, value);
    // console.log("apipost=>", postRes);
    return postRes.data;
  } catch (error) {
    return { error };
  }
};

export const deleteApihandler = async (endPoint) => {
  try {
    const deleteRes = await axios.delete(serverUrl + endPoint);
    return deleteRes.data;
  } catch (error) {
    return { error };
  }
};

export const putApihandler = async (endPoint, value) => {
  try {
    // Axios Method ----
    const res = await axios.put(serverUrl + endPoint, value);
    return res.data;

    // Fetch Method ----
    // const res = await fetch(serverUrl + endPoint, {
    //   method: "put",
    //   body: JSON.stringify(value),
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": "application/json",
    //   },
    // });
    // return res.data;
  } catch (error) {
    // console.log("error ");
    return { error };
  }
};
