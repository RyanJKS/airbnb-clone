'use client';
import Image from "next/image"
import { useAuth } from "../contexts/AuthContext"
import apiService from "../api/apiService";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";


interface Property {
    id: string;
    image_url: string;
    price_per_night: number;
    title: string;
}

interface Reservation {
    id: string;
    start_date: string;
    end_date: string;
    number_of_nights: number;
    total_price: number;
    property: Property;
}

const ReservationsPage = () => {

    const { userId } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const router = useRouter();

    const fetchReservations = useCallback(async () => {
        if (!userId) {
            return;
        }

        try {
            const response = await apiService.get('/api/auth/myreservations/');
            setReservations(response);
        } catch (error: any) {
            console.error('Failed to fetch reservations:', error);
        }
    }, [userId]);

    useEffect(() => {
        let isMounted = true;

        const fetchReservationsIfMounted = async () => {
            if (isMounted) await fetchReservations();
        };

        fetchReservationsIfMounted();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    console.log(reservations)


    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My Reservations</h1>

            <div className="space-y-4">
                {reservations.length === 0 ? (
                    <p>No reservations found.</p>
                ) : (
                    reservations.map((reservation) => (
                        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
                            <div className="col-span-1">
                                <div className="relative overflow-hidden aspect-square rounded-xl">
                                    <Image
                                        fill
                                        src={reservation.property.image_url || "/template_house.jpg"}
                                        alt={reservation.property.title}
                                        className="hover:scale-110 object-cover transition h-full w-full"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <h2 className="mb-4 text-xl">{reservation.property.title}</h2>

                                <p className="mb-2"><strong>Check in date: </strong>{reservation.start_date}</p>
                                <p className="mb-2"><strong>Check out date: </strong>{reservation.end_date}</p>
                                <p className="mb-2"><strong>Number of nights: </strong>{reservation.number_of_nights}</p>
                                <p className="mb-2"><strong>Total Price: </strong>£{reservation.total_price}</p>

                                <div
                                    onClick={() => router.push(`/properties/${reservation.property.id}`)}
                                    className="mt-6 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl">
                                    Go to property
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}

export default ReservationsPage;