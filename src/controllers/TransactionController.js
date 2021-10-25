const { default: axios } = require("axios");
const { connect } = require("../db");
const { calculateBitcoin } = require("../helpers/helpers");

exports.index = async (request, response) => {
  try {
    const userid = request.userid;

    const data = await axios.get(
      "https://www.mercadobitcoin.net/api/BTC/ticker/"
    );

    const { ticker } = data.data;

    let bitcoinBuy = ticker?.buy;

    const connection = await connect();

    const [rows] = await connection.query(
      `SELECT * FROM transactions WHERE user_id  = ? ORDER BY created_at ASC`,
      [userid]
    );

    const transactions = rows.map((item) => ({
      ...item,
      compare: item.priceBitcoin > bitcoinBuy ? false : true,
    }));

    return response.json({
      error: false,
      data: {
        bitcoinBuy: bitcoinBuy,
        transactions,
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

exports.store = async (request, response) => {
  const { amount, created_at, priceBitcoin } = request.body;
  const userid = request.userid;

  if (amount != "" && created_at != "" && priceBitcoin != "") {
    try {
      const connection = await connect();

      const qty = calculateBitcoin(amount, priceBitcoin);

      await connection.query(
        `INSERT INTO transactions (amount, qty, priceBitcoin, created_at, user_id) VALUES (?, ?, ?, ?, ?)`,
        [parseFloat(amount), qty, parseFloat(priceBitcoin), created_at, userid]
      );

      return response.json({
        error: false,
        message: "Congratulations, your transaction has been success",
      });
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error when trying saving transaction",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter value to your transaction",
    });
  }
};

exports.show = async (request, response) => {
  const { id } = request.query;
  const userid = request.userid;

  try {
    const data = await axios.get(
      "https://www.mercadobitcoin.net/api/BTC/ticker/"
    );

    const { ticker } = data.data;

    let bitcoinBuy = ticker?.buy;

    const connection = await connect();

    const [[row]] = await connection.query(
      `SELECT * FROM transactions WHERE id = ? AND user_id = ?`,
      [id, userid]
    );

    if (!row) {
      return response.json({
        error: true,
        message: "Transaction not found",
      });
    }

    return response.json({
      error: false,
      data: {
        bitcoinBuy,
        transaction: row,
      },
    });
  } catch (error) {
    console.log(error);
    return response.json({
      error: true,
      message: "Transaction not found",
    });
  }
};

exports.update = async (request, response) => {
  const { id } = request.query;
  const { amount, priceBitcoin } = request.body;
  const userid = request.userid;

  if (amount != "" && id != "" && priceBitcoin != "") {
    try {
      const connection = await connect();

      const [[row]] = await connection.query(
        `SELECT * FROM transactions WHERE id = ? AND user_id = ?`,
        [id, userid]
      );

      if (row) {
        const qty = calculateBitcoin(amount, priceBitcoin);

        await connection.query(
          `UPDATE transactions SET amount = ?, qty = ?, priceBitcoin = ? WHERE id = ? AND user_id = ?`,
          [amount, qty, priceBitcoin, row.id, userid]
        );

        return response.json({
          error: false,
          message: "Congratulations, your transaction has been success updated",
        });
      } else {
        return response.json({
          error: true,
          message: "Transaction not found",
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error when trying saving transaction",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter value to your transaction",
    });
  }
};

exports.getPrice = async (request, response) => {
  const { created_at, amount } = request.body;

  if (created_at != "" && amount != "") {
    try {
      const dateArr = created_at.split("-");
      const { data } = await axios.get(
        `https://www.mercadobitcoin.net/api/BTC/day-summary/${dateArr[0]}/${dateArr[1]}/${dateArr[2]}/`
      );

      let bitcoinBuy = data?.avg_price || 0;

      const qty = calculateBitcoin(amount, bitcoinBuy);

      let newData = {
        qtyBitcoin: qty,
        priceValue: parseFloat(bitcoinBuy),
        valueTransaction: parseFloat(amount),
      };

      const mergeData = Object.assign(data, newData);

      return response.json({ error: false, data: mergeData });
    } catch (error) {
      console.log(error);
      return response.json({ error: true, message: "Price not found" });
    }
  } else {
    return response.json({ error: true, message: "Please enter date value" });
  }
};

exports.destroy = async (request, response) => {
  const { id } = request.query;
  const userid = request.userid;

  try {
    const connection = await connect();

    await connection.query(
      `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
      [id, userid]
    );

    return response.json({ error: false, message: "Transaction deleted" });
  } catch (error) {
    console.log(error);
    return response.json({ error: true, message: "Transaction not found" });
  }
};
