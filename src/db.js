const mysql = require("mysql2/promise");

exports.connect = async () => {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  const connection = await mysql.createConnection(process.env.BATABASE_URL);
  console.log("Conected to MySQL!");
  global.connection = connection;
  return connection;
};
