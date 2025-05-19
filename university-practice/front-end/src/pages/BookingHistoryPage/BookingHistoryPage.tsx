import React, { useState, useEffect } from 'react';
import { getBookings } from '../../api/booking';
import { getSessionById } from '../../api/sessions';
import { Booking } from '../../types/booking';
import { MoviesSession } from '../../types/movies-session';
import './BookingHistoryPage.scss';
import Loader from '../../components/common/Loader/Loader';

interface BookingWithSession extends Booking {
    session?: MoviesSession;
}

const BookingHistoryPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingWithSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookingsWithSessions = async () => {
            try {
                setLoading(true);
                const bookingsData = await getBookings();
                
                // Fetch session details for each booking
                const bookingsWithSessions = await Promise.all(
                    bookingsData.map(async (booking) => {
                        try {
                            const session = await getSessionById(booking.sessionId);
                            return { ...booking, session };
                        } catch (err) {
                            console.error(`Error fetching session for booking:`, err);
                            return booking;
                        }
                    })
                );

                setBookings(bookingsWithSessions);
            } catch (err) {
                setError('Не вдалося завантажити історію бронювань');
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingsWithSessions();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div className="booking-history__error">{error}</div>;

    return (
        <div className="booking-history">
            <h1>Історія бронювань</h1>
            {bookings.length === 0 ? (
                <div className="booking-history__empty">
                    У вас ще немає бронювань
                </div>
            ) : (
                <div className="booking-history__list">
                    {bookings.map((booking) => (
                        <div key={booking.sessionId} className="booking-card">
                            {booking.session ? (
                                <div className="booking-card__content">
                                    <img 
                                        src={booking.session.movie.poster} 
                                        alt={booking.session.movie.title} 
                                        className="booking-card__poster"
                                    />
                                    <div className="booking-card__info">
                                        <h3>{booking.session.movie.title}</h3>
                                        <p>Дата: {booking.session.schedule.date}</p>
                                        <p>Час: {booking.session.schedule.times}</p>
                                        <p>Місця: {booking.seats.join(', ')}</p>
                                        <p>Ціна: {booking.totalPrice} грн</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="booking-card__error">
                                    Інформація про сеанс недоступна
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;