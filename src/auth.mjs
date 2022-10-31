import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// assumes that User was registered in `./db.mjs`
const User = mongoose.model("User");

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
};

const register = (
  username,
  email,
  password,
  errorCallback,
  successCallback
) => {
  // TODO: implement register
  if (username.length < 8 || password.length < 8) {
    errorCallback({
      message: "USERNAME PASSWORD TOO SHORT",
    });
    return;
  }

  const User = mongoose.model("User");

  User.find(username, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result > 0) {
        errorCallback({ message: "USERNAME ALREADY EXISTS", });
        return;
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            errorCallback({ message: "DOCUMENT SAVE ERROR" });
            return;
          } else {
            const newUser = new User({
              username: username,
              email: email,
              password: hash,
            });

            newUser.save((err) => {
              if (err) {
                errorCallback({ message: "DOCUMENT SAVE ERROR" });
                return;
              } else {
                successCallback(newUser);
                return;
              }
            });
          }
        });
      }
    }
  });
};

const login = (username, password, errorCallback, successCallback) => {
  // TODO: implement login
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = (authRequiredPaths) => {
  return (req, res, next) => {
    if (authRequiredPaths.includes(req.path)) {
      if (!req.session.user) {
        res.redirect("/login");
      } else {
        next();
      }
    } else {
      next();
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired,
};
