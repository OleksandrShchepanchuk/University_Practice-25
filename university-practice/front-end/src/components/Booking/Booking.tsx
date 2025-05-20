import React, { useEffect, useState } from 'react';
import { createBooking } from '../../api/booking';
import { getSessionById } from '../../api/sessions';
import { MoviesSession } from '../../types/movies-session';
import { SeatSelector } from './SeatsSelector/SeatsSelector.tsx';
import './Booking.scss';

interface BookingProps {
    sessionId: string;
}

const Booking: React.FC<BookingProps> = ({ sessionId }) => {
    const [session, setSession] = useState<MoviesSession | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSessionById(sessionId)
            .then(setSession)
            .catch(() => {
                alert('Не вдалося завантажити сеанс');
            });
    }, [sessionId]);

    const handleBook = async () => {
        if (!session || !session.id) return;

        setLoading(true);
        try {
            await createBooking({
                sessionId: session.id,
                seats: selectedSeats,
                totalPrice: selectedSeats.length * session.price,
            });
            alert('Успішно заброньовано!');
        } catch (e) {
            alert('Помилка при бронюванні');
        } finally {
            setLoading(false);
        }

    };

    if (!session) return <div>Завантаження...</div>;

    return (
        <div className="booking">
            <h2 className="booking__title">{session.movie.title}</h2>
            <p className="booking__info">
                Дата: {session.schedule.date} | Час: {session.schedule.times}
            </p>
            <p className="booking__price">Ціна за квиток: {session.price} грн</p>

            <SeatSelector
                maxSeats={session.maxSeats}
                bookedSeats={session.bookedSeats}
                selectedSeats={selectedSeats}
                onSelect={setSelectedSeats}
            />

            <p className="booking__total">До сплати: {selectedSeats.length * session.price} грн</p>

            <button className="booking__button" onClick={handleBook} disabled={loading || selectedSeats.length === 0}>
                Придбати квиток
            </button>
        </div>
    );
};

export default Booking;
