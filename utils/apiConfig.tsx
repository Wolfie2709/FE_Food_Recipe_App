export const API_CONFIG = {
    local_emulator: "http://10.0.2.2:5103/",
    phone_test: "http://192.168.117.220:5103/",
    HSU_test: "http://10.106.34.36/"
};


export const API_BASE_URL = API_CONFIG.local_emulator;

// For physical devices, override with your machine’s LAN IP
// e.g. export const API_BASE_URL = "http://10.0.2.2:7280";
