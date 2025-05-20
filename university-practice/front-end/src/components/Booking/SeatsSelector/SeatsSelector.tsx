import React from 'react';
import './SeatsSelector.scss';

interface SeatSelectorProps {
    maxSeats: number;
    bookedSeats: number[];
    selectedSeats: number[];
    onSelect: (seats: number[]) => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({ maxSeats, bookedSeats, selectedSeats, onSelect }) => {
    const seats = Array.from({ length: maxSeats }, (_, i) => i + 1);

    const toggleSeat = (seat: number) => {
        if (bookedSeats.includes(seat)) return;

        if (selectedSeats.includes(seat)) {
            onSelect(selectedSeats.filter((s) => s !== seat));
        } else {
            onSelect([...selectedSeats, seat]);
        }
    };

    return (
        <div className="seat-selector">
            {seats.map((seat) => (
                <button
                    key={seat}
                    className={`seat-selector__seat
            ${bookedSeats.includes(seat) ? 'seat-selector__seat--booked' : ''}
            ${selectedSeats.includes(seat) ? 'seat-selector__seat--selected' : ''}
          `}
                    onClick={() => toggleSeat(seat)}
                >
                    {seat}
                </button>
            ))}
        </div>
    );
};
