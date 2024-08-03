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

interface PropertyListProps {
    host_id?: string | null
}

const PropertyList: React.FC<PropertyListProps> = ({ host_id }) => {

    const [properties, setProperties] = useState<PropertyType[]>([])

    const getProperties = async () => {
        let url = '/api/properties/'

        if (host_id) {
            url += `?host_id=${host_id}`
        }

        const tempProperties = await apiService.get(url);
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