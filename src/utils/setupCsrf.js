import axios from "axios";

export function fetchCsrfCookie() {
  // This GET tells Django to send back a csrftoken cookie.
  return axios.get("http://localhost:8000/api/get-csrf-token/", {
    withCredentials: true, // ← browser will store the csrftoken cookie
  });
}