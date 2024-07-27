'use client';

import { useEffect, useState } from 'react';
import PropertyListItem from "./PropertyListItem"
import apiService from '@/app/api/apiService';


export type PropertyType = {
    id: string;
    title: string;
    price_per_night: number;
    image_url: string;
}

const PropertyList = () => {

    const [properties, setProperties] = useState<PropertyType[]>([])

    const getProperties = async () => {
        const tempProperties = await apiService.get('/api/properties/');
        setProperties(tempProperties.data)
    }

    useEffect(() => {
        getProperties();
    }, []);

    return (
        <>
            {properties?.map((property) => {
                return (
                    <PropertyListItem key={property.id} property={property} />
                )
            })}
        </>
    )
}

export default PropertyList