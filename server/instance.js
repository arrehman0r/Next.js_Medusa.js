import axios from "axios";
// import { ToastNotification } from "../Utils/ToastNotifications";
import Cookies from "js-cookie";  // Make sure to install js-cookie if not already installed
import { NEXT_PUBLIC_PROD_URL } from "~/env";

export const baseURL = NEXT_PUBLIC_PROD_URL;

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = async (type, path, body, token, options = {}) => {
  // Add api_key and user_id, ip and then add body parameter
  body = {
    ...body,
  };

  const connectSid = Cookies.get("connect.sid");
  console.log("connect.sid cookie:", connectSid);
  console.log("All cookies:", Cookies.get());
  const config = {
    timeout: 30000,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "connect.sid": connectSid,  // Include connect.sid cookie
    },
    ...options,
  };

  const res = instance[type](path, body, config)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error, "error");

      if (error.code === 401) {
        // ToastNotification("error", "Session expired. Please login again");
      } else if (error.code === "ECONNABORTED") {
        // ToastNotification("error", "Request timed out");
      }
      return error;
    });
  return res;
};

instance.interceptors.request.use(
  (config) => {
    // const username = "ck_b25676b8d09eb93723809e56bcc70767830ebbe4";
    // const password = "cs_d70f7243406cc40887939eb2df4bb4bf0515ab4b";
    config.auth = {
      // username,
      // password,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error?.response?.status === 401) {
      // window.location.reload(true);
      // window.location.href = "/";
      // window.localStorage.clear();
    }
    const code = error?.response && error?.response?.status;
    return Promise.reject({
      code,
    });
  }
);