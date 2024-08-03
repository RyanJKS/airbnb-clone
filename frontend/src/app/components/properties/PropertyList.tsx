'use client';

import { useEffect, useState, useCallback } from 'react';
import PropertyListItem from "./PropertyListItem";
import apiService from '@/app/api/apiService';

export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string;
    is_favourite: boolean;
};

interface PropertyListProps {
    host_id?: string | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ host_id }) => {
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
        const url = host_id ? `/api/properties/?host_id=${host_id}` : '/api/properties/';
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
    }, [host_id]);

    useEffect(() => {
        getProperties();
    }, [host_id]);

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