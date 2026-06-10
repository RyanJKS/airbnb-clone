import { useState, useEffect, useCallback } from 'react';
import { eachDayOfInterval } from 'date-fns';
import apiService from '@/app/api/apiService';

type Reservation = {
    start_date: string;
    end_date: string;
};

const useGetReservations = (propertyId: string) => {
    const [bookedDates, setBookedDates] = useState<Date[]>([]);

    const fetchReservations = useCallback(async () => {
        try {
            const reservations: Reservation[] = await apiService.get(`/api/properties/${propertyId}/reservations/`);
            // acc == Accumulator is an array that stores the data accumulated in each iteration
            const dates = reservations.reduce((acc: Date[], reservation) => {
                const range = eachDayOfInterval({
                    start: new Date(reservation.start_date),
                    end: new Date(reservation.end_date),
                });
                return [...acc, ...range];
            }, []);
            setBookedDates(dates);
        } catch (error) {
            console.log('Failed to fetch reservations.');
        }
    }, [propertyId]);

    useEffect(() => {
        if (propertyId) {
            fetchReservations();
        }
    }, [propertyId, fetchReservations]);

    return bookedDates;
};

export default useGetReservations;
