import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { SeatSelector } from '../../components/Booking/SeatsSelector/SeatsSelector';
import { loadSessions } from '../../store/slices/sessionsSlice';
import type { AppDispatch, RootState } from '../../store';
import type { MoviesSession } from '../../types/movies-session';
import { ConfirmModal } from '../../components/common/ConfirmModal/ConfirmModal';

import './BookingPage.scss';
import Loader from '../../components/common/Loader/Loader';
import { createBooking } from '../../api/booking';

const BookingPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { movieId } = useParams<{ movieId: string }>();

    const { list: allSessions, hasLoaded, loading } = useSelector((state: RootState) => state.sessions);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const [sessions, setSessions] = useState<MoviesSession[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSession, setSelectedSession] = useState<MoviesSession | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const tryBuy = () => setConfirmOpen(true);

    const handleInstantBuy = async () => {
        if (!selectedSession || processing) return;
        setConfirmOpen(false);
        try {
            setProcessing(true);
            const res = await createBooking({
                sessionId: selectedSession.id as string,
                seats: selectedSeats,
                totalPrice: selectedSeats.length * selectedSession.price,
            });
            if (!res) throw new Error('Не вдалося оформити квиток');
            console.log('Booking successful:', res);
        } catch (e: any) {
            setErrorMsg(e.message || 'Помилка оформлення');
        } finally {
            setProcessing(false);
        }
    };
    /* pick session from URL after list is ready */
    useEffect(() => {
        const id = searchParams.get('session');
        if (!id || !sessions.length) return;
        const found = sessions.find((s) => s.id === id);
        if (found) setSelectedSession(found);
        console.log(id);
    }, [sessions, searchParams]);

    /* helper for clicks */
    const chooseSession = (session: MoviesSession) => {
        setSelectedSession(session);
        setSearchParams((prev) => {
            prev.set('session', session.id as string);
            return prev;
        });
    };

    useEffect(() => {
        if (!hasLoaded && !loading) {
            dispatch(loadSessions());
        }
    }, [dispatch, hasLoaded, loading]);

    useEffect(() => {
        if (!movieId) return;

        const today = format(new Date(), 'yyyy-MM-dd');
        const filtered = allSessions
            .filter((s) => s.movie.id === movieId && s.schedule.date >= today)
            .sort((a, b) => a.schedule.date.localeCompare(b.schedule.date));

        setSessions(filtered);

        if (filtered.length) {
            setSelectedDate(filtered[0].schedule.date);
            setSelectedSession(null);
        }
    }, [allSessions, movieId]);

    const uniqueDates = Array.from(new Set(sessions.map((s) => s.schedule.date)));
    const sessionsForDate = sessions.filter((s) => s.schedule.date === selectedDate);

    let price = (selectedSession?.price ?? sessionsForDate[0]?.price) || 0;
    price = selectedSeats.length ? price * selectedSeats.length : price;

    return (
        <div className="booking-page">
            <div className="booking-page__card">
                <ConfirmModal
                    open={confirmOpen}
                    title="Підтвердження покупки"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handleInstantBuy}
                >
                    Ви впевнені, що хочете придбати квиток на вибраний сеанс?
                </ConfirmModal>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="booking-page__poster">
                            <img src={sessions[0]?.movie.poster} alt={sessions[0]?.movie.title} />
                        </div>
                        <div className="booking-page__info">
                            <h2 className="booking-page__title">{sessions[0]?.movie.title || 'Завантаження...'}</h2>

                            <div className="booking-page__dates">
                                <button className="booking-page__date-btn--nav">&#8249;</button>

                                {uniqueDates.map((date) => (
                                    <button
                                        key={date}
                                        className={`booking-page__date-btn ${
                                            date === selectedDate ? 'booking-page__date-btn--active' : ''
                                        }`}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setSelectedSession(null);
                                        }}
                                    >
                                        <span className="booking-page__date-day">
                                            {format(new Date(date), 'dd/MM')}
                                        </span>
                                        <span className="booking-page__date-weekday">
                                            {format(new Date(date), 'EEEE', { locale: uk }).toUpperCase()}
                                        </span>
                                    </button>
                                ))}

                                <button className="booking-page__date-btn--nav">&#8250;</button>
                            </div>

                            <div className="booking-page__times">
                                {sessionsForDate.map((session) => (
                                    <button
                                        key={session.id}
                                        className={`booking-page__time-btn ${
                                            session.id === selectedSession?.id ? 'booking-page__time-btn--active' : ''
                                        }`}
                                        onClick={() => chooseSession(session)}
                                    >
                                        {session.schedule.times}
                                    </button>
                                ))}
                            </div>

                            <div className="booking-page__summary">
                                <span className="booking-page__summary-label">До сплати:</span>
                                <span className="booking-page__summary-value">{price} грн</span>
                            </div>

                            <div className="booking-page__actions">
                                {!selectedSession ? (
                                    <div className="booking-page__seats-placeholder">Виберіть сеанс</div>
                                ) : (
                                    <>
                                        <button
                                            className="booking-page__book-btn"
                                            disabled={processing || !selectedSeats.length}
                                            onClick={tryBuy}
                                        >
                                            {processing ? 'Оформлення…' : 'Придбати квиток'}
                                        </button>
                                        <SeatSelector
                                            maxSeats={selectedSession.maxSeats}
                                            bookedSeats={selectedSession?.bookedSeats || []}
                                            selectedSeats={selectedSeats}
                                            onSelect={setSelectedSeats}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
