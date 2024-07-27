"use server";
import { cookies } from "next/headers";

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
