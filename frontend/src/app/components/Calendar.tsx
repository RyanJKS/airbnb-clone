'use client';

import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CalendarProps {
    value: Range,
    onChange: (value: RangeKeyDict) => void;
    bookedDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    bookedDates
}) => {
    return (
        <div className="w-full">
            <DateRange
                className="w-full border border-gray-400 rounded-xl mb-4"
                rangeColors={['#262626']}
                ranges={[value]}
                date={new Date()}
                onChange={onChange}
                direction="vertical"
                showDateDisplay={false}
                minDate={new Date()}
                disabledDates={bookedDates}
            />
        </div>
    );
}

export default Calendar;
