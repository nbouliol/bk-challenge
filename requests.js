const axios = require("axios").default;
const qs = require("qs");

/**
 * @description Gets the refresh token
 *
 * @param {string} host
 * @param {string} userLogin
 * @param {string} password
 * @param {string} clientId
 * @param {string} secret
 * @returns {string} Refresh Token
 */
async function getRefreshToken(host, userLogin, password, clientId, secret) {
  return await axios({
    method: "post",
    url: `${host}/login`,
    data: {
      user: userLogin,
      password,
    },
    headers: {
      "Content-Type": "application/json",
      authorization:
        "Basic " + Buffer.from(clientId + ":" + secret).toString("base64"),
    },
  })
    .then(function (response) {
      return response.data.refresh_token;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

/**
 * @description Gets the access token
 * @param {string} host
 * @param {string} refresh_token
 * @returns {string} Access token
 */
async function getAccessToken(host, refresh_token) {
  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  return axios({
    method: "post",
    url: `${host}/token`,
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      return response.data.access_token;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

/**
 * @description Gets the accounts for the provided access token
 * @param {string} host
 * @param {string} access_token
 * @returns {Array} List of accounts
 */
async function getAccounts(host, access_token) {
  return axios({
    method: "get",
    url: `${host}/accounts`,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${access_token}`,
    },
  })
    .then(function (response) {
      return response.data.account;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

/**
 * @description Get the transactions for the provided account
 *
 * @param {string} host
 * @param {Object} account
 * @param {string} access_token
 * @returns {Object} Transaction
 */
async function getTransactions(host, account, access_token) {
  return axios({
    method: "get",
    url: `${host}/accounts/${account.acc_number}/transactions`,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${access_token}`,
    },
  })
    .then(function (response) {
      return response.data.transactions;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

exports.getRefreshToken = getRefreshToken;
exports.getAccessToken = getAccessToken;
exports.getAccounts = getAccounts;
exports.getTransactions = getTransactions;
