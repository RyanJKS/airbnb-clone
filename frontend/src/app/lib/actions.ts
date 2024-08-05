"use server";
import { cookies } from "next/headers";
import axios from 'axios';

// sets cookies when login
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    cookies().set('session_userId', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
        path: '/'
    })

    cookies().set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 60 mins
        path: '/'
    })

    cookies().set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
        path: '/'
    })
}

export async function resetAuthCookies() {
    cookies().set('session_userId', '')
    cookies().set('session_access_token', '')
    cookies().set('session_refresh_token', '')
}

export async function getUserId() {
    const userId = cookies().get('session_userId')?.value;
    return userId
}

export async function getAccessToken() {
    let accessToken = cookies().get('session_access_token')?.value;
    if (!accessToken) {
        accessToken = await handleRefresh();
    }
    return accessToken
}

export async function getRefreshToken() {
    let refreshToken = cookies().get('session_refresh_token')?.value;

    return refreshToken;
}

export async function handleRefresh() {

    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
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
            cookies().set('session_access_token', data.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60, // 60 minutes
                path: '/'
            });

            return data.access;
        } else {
            resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.log('Error refreshing token:', error);
        resetAuthCookies();
        return null;
    }
}