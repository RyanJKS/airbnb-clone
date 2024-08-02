import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import apiService from '@/app/api/apiService';
import { Range } from 'react-date-range';
import { Property } from '@/app/components/properties/ReservationSidebar'

const useReservation = (property: Property, dateRange: Range, guests: string) => {
    const [fee, setFee] = useState<number>(0);
    const [nights, setNights] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);
            const calculatedFee = ((dayCount * property.price_per_night) / 100) * 5;
            const price = (dayCount * property.price_per_night) + calculatedFee;

            setFee(calculatedFee);
            setTotalPrice(price);
            setNights(dayCount || 1);
        }
    }, [dateRange, property.price_per_night]);

    const handleDateRangeChange = (selection: any) => {
        const newStartDate = new Date(selection.startDate);
        const newEndDate = new Date(selection.endDate);

        if (newEndDate <= newStartDate) {
            newEndDate.setDate(newStartDate.getDate() + 1);
        }

        setDateRange({
            ...dateRange,
            startDate: newStartDate,
            endDate: newEndDate
        });
    };

    const bookReservation = async (): Promise<boolean> => {
        try {
            const formData = new FormData();
            formData.append('guests', guests);
            formData.append('start_date', format(dateRange.startDate, 'yyyy-MM-dd'));
            formData.append('end_date', format(dateRange.endDate, 'yyyy-MM-dd'));
            formData.append('number_of_nights', nights.toString());
            formData.append('total_price', totalPrice.toString());

            const response = await apiService.post(`/api/properties/${property.id}/book/`, formData);

            return response.success;
        } catch (error) {
            console.error('Failed to make a reservation', error);
            return false;
        }
    };

    return { fee, nights, totalPrice, handleDateRangeChange, bookReservation };
};

export default useReservation;