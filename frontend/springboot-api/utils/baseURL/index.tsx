import axios from "axios";

const request = axios.create({  
  baseURL: "/api/v1/", // Sử dụng URL Của APIGateWay

});
export default request;