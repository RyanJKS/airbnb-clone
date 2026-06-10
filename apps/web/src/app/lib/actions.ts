import axios from 'axios';
import { getApiBaseUrl } from "@/lib/runtime-config";

const ONE_HOUR = 60 * 60;
const ONE_WEEK = 60 * 60 * 24 * 7;

function canUseCookies() {
    return typeof document !== "undefined";
}

function setCookie(name: string, value: string, maxAge: number) {
    if (!canUseCookies()) {
        return;
    }

    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
    if (!canUseCookies()) {
        return null;
    }

    const cookies = document.cookie.split("; ").filter(Boolean);
    const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    if (!match) {
        return null;
    }

    return decodeURIComponent(match.split("=").slice(1).join("="));
}

function clearCookie(name: string) {
    setCookie(name, "", 0);
}

// sets cookies when login
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    setCookie('session_userId', userId, ONE_WEEK);
    setCookie('session_access_token', accessToken, ONE_HOUR);
    setCookie('session_refresh_token', refreshToken, ONE_WEEK);
}

export async function resetAuthCookies() {
    clearCookie('session_userId');
    clearCookie('session_access_token');
    clearCookie('session_refresh_token');
}

export async function getUserId() {
    return getCookie('session_userId');
}

export async function getAccessToken() {
    let accessToken = getCookie('session_access_token');
    if (!accessToken) {
        const refreshToken = getCookie('session_refresh_token');
        if (!refreshToken) {
            return null;
        }

        accessToken = await handleRefresh(refreshToken);
    }
    return accessToken ?? null;
}

export async function getRefreshToken() {
    return getCookie('session_refresh_token');
}

export async function handleRefresh(existingRefreshToken?: string | null) {

    try {
        const refreshToken = existingRefreshToken ?? await getRefreshToken();

        if (!refreshToken) {
            return null;
        }

        const response = await axios.post(`${getApiBaseUrl()}/api/auth/token/refresh/`, {
            refresh: refreshToken
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;
        console.log('Response - Refresh:', data);

        if (data.access) {
            setCookie('session_access_token', data.access, ONE_HOUR);
            return data.access;
        } else {
            await resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        await resetAuthCookies();
        return null;
    }
}
