import Constants from "expo-constants";

// Detects the host that Expo is running on so the mobile app can
// reach the local backend when developing. Falls back to localhost.
const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

export const API_URL = `http://${host}:3000`;
