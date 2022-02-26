import axios from 'axios';

// const TOKEN = localStorage.getItem("persist:root") &&
//     JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token;

export const unauthenticatedReq = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

