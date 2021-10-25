const { default: axios } = require("axios");
const { connect } = require("../db");
const { calculateBitcoin } = require("../helpers/helpers");

exports.index = async (request, response) => {
  const userid = request.userid;
  try {
    const data = await axios.get(
      "https://www.mercadobitcoin.net/api/BTC/ticker/"
    );

    const { ticker } = data.data;

    let bitcoinBuy = ticker?.buy;

    const connection = await connect();

    const [[row]] = await connection.query(
      `SELECT sum(amount) as amount, sum(qty) as qty FROM transactions WHERE user_id  = ?`,
      [userid]
    );

    const [rows] = await connection.query(
      `SELECT created_at, qty, amount FROM transactions WHERE user_id  = ? ORDER BY created_at ASC`,
      [userid]
    );

    const transactionsCompare = rows.map((item) => {
      return {
        ...item,
        qty: calculateBitcoin(item.amount, bitcoinBuy),
      };
    });

    return response.json({
      error: false,
      data: {
        transactionSum: {
          ...row,
          amount: row.amount,
        },
        bitcoinBuy: bitcoinBuy,
        transactions: rows,
        transactionsCompare,
      },
    });
  } catch (error) {
    console.log(error);
    return response.json({
      error: true,
      message: "Transactions not found",
    });
  }
};
