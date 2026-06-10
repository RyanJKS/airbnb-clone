'use client';

import { useEffect, useState, useCallback } from 'react';
import PropertyListItem from './PropertyListItem';
import apiService from '@/app/api/apiService';
import { useFilters } from '@/app/contexts/FiltersContext';

export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string;
    is_favourite: boolean;
};

interface PropertyListProps {
    host_id?: string | null;
    favourites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ host_id, favourites }) => {
    const { filters } = useFilters();
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const markFavourite = useCallback((id: string, is_favourite: boolean) => {
        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                property.id === id ? { ...property, is_favourite } : property
            )
        );
        console.log(`Property ${is_favourite ? 'added to' : 'removed from'} list of favourites.`);
    }, []);

    const getProperties = useCallback(async () => {
        let url = '/api/properties/';

        if (host_id) {
            url += `?host_id=${host_id}`;
        } else if (favourites) {
            url += '?is_favourites=true';
        } else {
            const params = new URLSearchParams();

            if (filters.destination) {
                params.append('country', filters.destination);
            }
            if (filters.checkIn) {
                params.append('checkIn', filters.checkIn);
            }
            if (filters.checkOut) {
                params.append('checkOut', filters.checkOut);
            }
            if (filters.guests) {
                params.append('numGuests', filters.guests.toString());
            }
            if (filters.category) {
                params.append('category', filters.category);
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        console.log(url)

        try {
            const response = await apiService.get(url);
            const updatedProperties = response.data.map((property: PropertyType) => ({
                ...property,
                is_favourite: response.favourites.includes(property.id),
            }));
            setProperties(updatedProperties);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    }, [filters]);

    useEffect(() => {
        getProperties();
    }, [filters]);

    return (
        <>
            {properties.map((property) => (
                <PropertyListItem
                    key={property.id}
                    property={property}
                    markFavourite={markFavourite}
                />
            ))}
        </>
    );
};

export default PropertyList;
