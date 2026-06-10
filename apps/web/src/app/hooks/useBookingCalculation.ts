import { useMemo, useCallback } from 'react';
import { differenceInDays } from 'date-fns';
import { Range } from 'react-date-range';
import { Property } from '../components/properties/ReservationSidebar';


const useBookingCalculation = (property: Property, dateRange: Range) => {
    const calculateFeeAndTotalPrice = useCallback(() => {
        const startDate = dateRange.startDate || new Date();
        const endDate = dateRange.endDate || new Date();
        const dayCount = differenceInDays(endDate, startDate);
        const nights = dayCount || 1;
        const fee = parseFloat((((nights * property.price_per_night) / 100) * 5).toFixed(2)); // 5% fee from total price
        const totalPrice = parseFloat(((nights * property.price_per_night) + fee).toFixed(2));

        return { nights, fee, totalPrice };
    }, [dateRange]);

    const { fee, nights, totalPrice } = useMemo(calculateFeeAndTotalPrice, [calculateFeeAndTotalPrice]);

    return { fee, nights, totalPrice };
};

export default useBookingCalculation;