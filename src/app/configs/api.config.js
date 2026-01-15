const domain =
  process.env.REACT_APP_ENV !== "prod"
    ? "http://localhost:8083"
    : "http://localhost:8083";

const baseURL = `${domain}/api/`;
const accessTokenKey = "jwt_access_token";
const refreshTokenKey = "jwt_refresh_token";


const apiConfig = {
  baseURL,
  accessTokenKey,
  refreshTokenKey,
};

export default apiConfig;
