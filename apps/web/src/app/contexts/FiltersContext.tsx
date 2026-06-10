'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface Filters {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    category?: string;
}

interface FiltersContextProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

const FiltersContext = createContext<FiltersContextProps | undefined>(undefined);

export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FiltersProvider');
    }
    return context;
};

interface FiltersProviderProps {
    children: ReactNode;
}

export const FiltersProvider: React.FC<FiltersProviderProps> = ({ children }) => {
    const [filters, setFilters] = useState<Filters>({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        category: '',
    });

    return (
        <FiltersContext.Provider value={{ filters, setFilters }}>
            {children}
        </FiltersContext.Provider>
    );
};
