'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// A custom function to format the dates for comparison
const getUTCDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export default function HabitCalendar({ history }) {
    // Create a Set of dates for efficient lookup
    const completedDates = new Set(
        history.map(item => getUTCDate(item.date).toDateString())
    );

    const tileClassName = ({ date, view }) => {
        // Check if the current tile's date is in our Set
        if (view === 'month' && completedDates.has(getUTCDate(date).toDateString())) {
            return 'bg-green-500 rounded-full text-white'; // Tailwind class for completed days
        }
        return '';
    };

    return (
        <div>
            <Calendar
                tileClassName={tileClassName}
                className="w-full border-none"
            />
        </div>
    );
}
