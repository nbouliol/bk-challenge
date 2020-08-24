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
  try {
    const response = await axios({
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
    });
    return response.data.refresh_token;
  } catch (e) {
    // handle error
  }
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

  try {
    const response = await axios({
      method: "post",
      url: `${host}/token`,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (e) {
    // handle error
  }
}

/**
 * @description Gets the accounts for the provided access token
 * @param {string} host
 * @param {string} access_token
 * @returns {Array} List of accounts
 */
async function getAccounts(host, access_token) {
  let accounts = [];
  let nextPage = true;
  let page = 1;

  try {
    while (nextPage) {
      let response = await axios({
        method: "get",
        url: `${host}/accounts`,
        params: {
          page,
        },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
      });

      page += 1;
      accounts = accounts.concat(response.data.account);

      if (!response.data.link || !response.data.link.next) {
        nextPage = false;
      }
    }
  } catch (e) {
    // handle fetch error
  }

  return accounts;
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
  let transactions = [];
  let nextPage = true;
  let page = 1;

  try {
    while (nextPage) {
      let response = await axios({
        method: "get",
        url: `${host}/accounts/${account.acc_number}/transactions`,
        params: {
          page,
        },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
      });

      transactions = transactions.concat(response.data.transactions);
      page += 1;

      if (!response.data.link || !response.data.link.next) {
        nextPage = false;
      }
    }
  } catch (e) {
    // handle fetch error
  }
  return transactions;
}

exports.getRefreshToken = getRefreshToken;
exports.getAccessToken = getAccessToken;
exports.getAccounts = getAccounts;
exports.getTransactions = getTransactions;
