require("dotenv").config();
const requests = require("./requests");
const util = require("util");

/**
 *
 * @description Iterates through accounts, gets the transactions and parse
 *
 * @param {string} host
 * @param {Array} accounts
 * @param {string} access_token
 */
async function getTransactionsAndParse(host, accounts, access_token) {
  let array = [];

  for (const account of accounts) {
    let transactions = await requests.getTransactions(
      host,
      account,
      access_token
    );

    array.push({
      acc_number: account.acc_number,
      amount: account.amount,
      transactions: transactions.map((x) => ({
        label: x.label,
        amount: x.amount,
        currency: x.currency,
      })),
    });
  }

  return array;
}

async function main() {
  // load env variables
  const host = process.env.HOST;
  const userLogin = process.env.USER_LOGIN;
  const password = process.env.PASSWORD;
  const clientId = process.env.CLIENT_ID;
  const secret = process.env.SECRET;

  const refresh_token = await requests.getRefreshToken(
    host,
    userLogin,
    password,
    clientId,
    secret
  );

  const access_token = await requests.getAccessToken(host, refresh_token);

  const accounts = await requests.getAccounts(host, access_token);

  const transactions = await getTransactionsAndParse(
    host,
    accounts,
    access_token
  );

  console.log(util.inspect(transactions, false, null, true));
}

main();
