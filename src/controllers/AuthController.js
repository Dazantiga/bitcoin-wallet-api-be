const bcrypt = require("bcryptjs");
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { connect } = require("../db");

const transporter = mailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

exports.login = async (request, response) => {
  const { email, password } = request.body;

  if (email != "" && password != "") {
    try {
      const connection = await connect();

      const [[row]] = await connection.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (row) {
        if (!bcrypt.compareSync(password, row.password)) {
          return response.json({
            error: true,
            message: "Could not find a user with these credentials",
          });
        }

        const token = jwt.sign(
          { userid: row.id, email: row.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return response.json({ error: false, token });
      } else {
        return response.json({
          error: true,
          message: "Could not find a user with these credentials",
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error trying to login",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter your credentials to enter the system",
    });
  }
};

exports.register = async (request, response) => {
  const { name, email, password } = request.body;

  if (name != "" && email != "" && password != "") {
    try {
      const connection = await connect();

      const [row] = await connection.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (!row.length) {
        let hashPassword = await bcrypt.hash(password, 8);

        await connection.query(
          `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
          [name, email, hashPassword]
        );
        return response.json({
          error: false,
          message:
            "Congratulations, your registration has been completed, you can login",
        });
      } else {
        return response.json({
          error: true,
          message:
            "There is already a user with this email, try another one or login",
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error when trying to register the user",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter your data to register in the system",
    });
  }
};

exports.forgot = async (request, response) => {
  const { email } = request.body;

  if (email != "") {
    try {
      const connection = await connect();

      const [[row]] = await connection.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (row) {
        const token = `${new Date().getTime()}-${new Date().getTime() + 10}`;

        await connection.query(
          `UPDATE users SET token_forget = ? WHERE id = ?`,
          [token, row.id]
        );

        let link = `http://localhost:9009/reset?token=${token}`;

        const data = {
          from: process.env.MAILER_FROM,
          to: row.email,
          subject: "Password recovery",
          text: `Follow the link to recover your password, please login and follow the instructions: ${link}`,
        };

        transporter.sendMail(data, (error, info) => {
          if (error) console.log(error);
          return true;
        });

        return response.json({
          error: false,
          message:
            "We have sent you an email with the link to retrieve your password, please login and follow the instructions",
        });
      } else {
        return response.json({
          error: true,
          message: "We couldn't find a user with this email.",
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error trying to recover password",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter your email to retrieve your password",
    });
  }
};

exports.reset = async (request, response) => {
  const { email, password, token } = request.body;

  if (email != "" && password != "" && token != "") {
    try {
      const connection = await connect();

      const [[row]] = await connection.query(
        `SELECT * FROM users WHERE token_forget = ?`,
        [token]
      );

      if (row) {
        let hashPassword = await bcrypt.hash(password, 8);

        await connection.query(
          `UPDATE users SET token_forget = null, password = ? WHERE id = ?`,
          [hashPassword, row.id]
        );

        return response.json({
          error: false,
          message: "Congratulations your password has been updated",
        });
      } else {
        return response.json({
          error: true,
          message: "Could not find a user with this email and token",
        });
      }
    } catch (error) {
      console.log(error);
      return response.json({
        error: true,
        message: "Error trying to reset password",
      });
    }
  } else {
    return response.json({
      error: true,
      message: "Please enter the data to reset your password",
    });
  }
};

exports.logout = (request, response) => {
  return response.json({
    error: false,
    token: null,
    message: "Logout",
  });
};
