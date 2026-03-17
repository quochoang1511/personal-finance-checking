import axios from "axios";

const request = axios.create({  
//   baseURL: "https://catkinhonline.onrender.com/api/", // Sử dụng URL Của APIGateWay
   baseURL: "http://localhost:8080/api/v1/", // Sử dụng URL Của APIGateWay
  // baseURL: "https://7nt1w10n-7057.asse.devtunnels.ms/api/", // Sử dụng URL Của APIGateWay
});
export default request;