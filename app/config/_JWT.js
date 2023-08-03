const jwt = require("jsonwebtoken");
const _APP = require("./_APP");

let make = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { data: user },
      _APP.ACCESS_TOKEN,
      {
        algorithm: "HS256",
        expiresIn: _APP.TOKEN_TIME_LIFE,
      },
      (err, _token) => {
        if (err) return reject(err);
        return resolve(_token);
      }
    );
  });
};

let check = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, _APP.ACCESS_TOKEN, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

module.exports = {
  make: make,
  check: check,
};
