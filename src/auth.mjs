import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// assumes that User was registered in `./db.mjs`


const startAuthenticatedSession = (req, user, cb) => {
  req.session.regenerate((err) => {
    if(!err) {
      req.session.user = user;
    } else {
      console.log(err);
      cb(err);
    }
  })
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
    errorCallback(new Error("USERNAME PASSWORD TOO SHORT"));
  } else {
    const User = mongoose.model("User");
    User.find({"username" : username}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          errorCallback(new Error("USERNAME ALREADY EXISTS"));
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              errorCallback(new Error("DOCUMENT SAVE ERROR"));
            } else {
              const newUser = new User({
                "username": username,
                "email": email,
                "password": hash,
              });
  
              newUser.save((err) => {
                if (err) {
                  errorCallback(new Error("DOCUMENT SAVE ERROR"));
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
  }
};

const login = (username, password, errorCallback, successCallback) => {
  const User = mongoose.model("User");
  User.findOne({"username": username}, (err, user) => {
    if(!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(passwordMatch == true) {
          successCallback(user);
        } else {
          errorCallback(new Error("PASSWORDS DO NOT MATCH"));
        }
      })

    } else{
      errorCallback(new Error("USER NOT FOUND"))
      console.log(err);
    } 
  }) 
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
