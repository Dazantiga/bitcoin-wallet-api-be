exports.calculateBitcoin = (amount, priceBitcoin) => {
  return (parseFloat(amount) * 1) / parseFloat(priceBitcoin);
};

exports.formatDate = (date) => {
  return `${new Date(date).getFullYear()}-${
    new Date(date).getMonth() + 1
  }-${new Date(date).getDate()}`;
};

exports.formatDateBR = (date) => {
  return `${new Date(date).getDate()}/${
    new Date(date).getMonth() + 1
  }/${new Date(date).getFullYear()}`;
};
