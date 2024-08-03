'use client';
import { useState, useEffect } from "react";
import apiService from "@/app/api/apiService";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import Image from "next/image";
import Link from "next/link";


interface Host {
    id: string;
    name: string;
    profile_img_url: string;
}

interface Property {
    id: string;
    title: string;
    description: string;
    price_per_night: number;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    country: string;
    country_code: string;
    category: string;
    created_at: string;
    host: Host;
    images: string[];
}

// Grab the uuid from the page in params
const PropertyDetailPage = ({ params }: { params: { id: string } }) => {
    const [property, setProperty] = useState<Property | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await apiService.get(`/api/properties/${params.id}/`);
                setProperty(response);
                setLoading(false);
            } catch (error: any) {
                setErrors(error.message || 'Error fetching property details');
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProperty();
        }
    }, [params.id]);

    const handleNextImage = () => {
        if (property) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
        }
    };

    const handlePrevImage = () => {
        if (property) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (errors) return <div>Error loading property details: {errors}</div>;

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
                {property && property.images.length > 0 ? (
                    <Image
                        fill
                        src={property.images[currentImageIndex]}
                        className="object-cover w-full h-full"
                        alt="Property Image"
                    />
                ) : (
                    <Image
                        fill
                        src='/template_house.jpg'
                        className="object-cover w-full h-full"
                        alt="Template House"
                    />
                )}
                <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white border rounded-full shadow-md"
                >
                    &lt;
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white border rounded-full shadow-md"
                >
                    &gt;
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    {property && (
                        <>
                            <h1 className="mb-4 text-4xl">{property.title}</h1>

                            <span className="mb-6 block text-lg text-gray-600">
                                {property.guests} guest - {property.bedrooms} bedrooms - {property.bathrooms} bathroom
                            </span>

                            <hr />

                            <Link
                                href={`/hosts/${property.host.id}`}
                                className="py-6 flex items-center space-x-4">
                                <Image
                                    src={property.host.profile_img_url || "/template_host_image.jpeg"}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                    alt="Host Image"
                                />

                                <p><strong>{property.host.name}</strong> is your host</p>
                            </Link>

                            <hr />

                            <p className="mt-6 text-lg">
                                {property.description}
                            </p>
                        </>
                    )}
                </div>

                {property && <ReservationSidebar property={property} />}
            </div>
        </main>
    )
}

export default PropertyDetailPage;
