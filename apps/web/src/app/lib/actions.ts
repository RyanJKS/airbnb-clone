"use server";
import { cookies } from "next/headers";
import axios from 'axios';
import { getApiBaseUrl } from "@/lib/runtime-config";

// sets cookies when login
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set('session_userId', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
        path: '/'
    })

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 60 mins
        path: '/'
    })

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
        path: '/'
    })
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();

    cookieStore.set('session_userId', '')
    cookieStore.set('session_access_token', '')
    cookieStore.set('session_refresh_token', '')
}

export async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userId')?.value;
    return userId ?? null;
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('session_access_token')?.value;
    if (!accessToken) {
        accessToken = await handleRefresh();
    }
    return accessToken ?? null;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('session_refresh_token')?.value;

    return refreshToken ?? null;
}

export async function handleRefresh() {

    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
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
            const cookieStore = await cookies();

            cookieStore.set('session_access_token', data.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60, // 60 minutes
                path: '/'
            });

            return data.access;
        } else {
            await resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.log('Error refreshing token:', error);
        await resetAuthCookies();
        return null;
    }
}
