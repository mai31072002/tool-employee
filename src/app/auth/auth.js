import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as userActions from "./store/actions";
import jwtService from "../service/jwt";

function SplashScreen() {
  return (
    <div className="pageloader">
      <span className="title">Loading...</span>
    </div>
  );
}

const Auth = ({ children }) => {
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkJwt = () =>
      new Promise((resolve) => {
        jwtService.on("onAutoLogin", () => {
          jwtService
            .signInWithRefreshToken()
            .then((user) => {
              dispatch(userActions.setUserData({
                data: user.data,
                role: [user.role],
              }));
              resolve();
            })
            .catch(() => resolve());
        });

        jwtService.on("onAutoLogout", (message) => {
          if (message) console.log(message);
          dispatch(userActions.logoutUser());
          resolve();
        });

        jwtService.on("onNoAccessToken", () => resolve());

        jwtService.init();
      });

    checkJwt().then(() => setWaitAuthCheck(false));
  }, [dispatch]);

  return waitAuthCheck ? <SplashScreen /> : <>{children}</>;
};

export default Auth;
