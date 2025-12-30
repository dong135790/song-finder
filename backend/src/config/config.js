// backend/src/config/config.js
import axios from "axios";
import "dotenv/config";

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "shazam-core.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export const shazamClient = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`, // ✅ NO /v1 here
  headers: {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
  },
  timeout: 15000,
});

shazamClient.interceptors.request.use((config) => {
  const qs = config.params ? `?${new URLSearchParams(config.params).toString()}` : "";
  console.log("➡️ RapidAPI:", `${config.baseURL}${config.url}${qs}`);
  return config;
});