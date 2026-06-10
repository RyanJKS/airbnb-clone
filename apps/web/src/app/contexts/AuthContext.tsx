// contexts/AuthContext.tsx
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserId } from '../lib/actions';

interface AuthContextProps {
    userId: string | null;
    refreshUserId: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);

    const refreshUserId = async () => {
        const id = await getUserId();
        setUserId(id);
    };

    useEffect(() => {
        refreshUserId();
    }, []);

    return (
        <AuthContext.Provider value={{ userId, refreshUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
