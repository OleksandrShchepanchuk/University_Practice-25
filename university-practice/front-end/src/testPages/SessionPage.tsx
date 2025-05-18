import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadSessions } from '../store/slices/sessionsSlice'; // make sure this is correct path
import MoviesView from '../components/Movies/MoviesView/MoviesView';
import { MovieWithSession } from '../types/movie';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import Loader from '../components/common/Loader/Loader';

const SessionsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: sessions, loading, error, hasLoaded } = useSelector((state: RootState) => state.sessions);

    useEffect(() => {
        if (!hasLoaded && !loading && !error) dispatch(loadSessions());
    }, [dispatch]);

    const grouped: Record<string, MovieWithSession[]> = {};

    sessions.forEach((session) => {
        const date = session.schedule.date;
        const time = session.schedule.times;
        const movieId = session.movie.id;

        if (!grouped[date]) grouped[date] = [];

        const existingMovie = grouped[date].find((item) => item.id === movieId);

        if (existingMovie) {
            existingMovie.schedule[0].times.push(time);
        } else {
            grouped[date].push({
                ...session.movie,
                price: session.price,
                schedule: [
                    {
                        date,
                        times: [time],
                    },
                ],
            });
        }
    });

    const sortedDates = Object.keys(grouped).sort();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    console.log('grouped', grouped);
    return (
        <div className="grouped-sessions-page">
            {loading && <Loader />}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="date-selector" style={{ marginBottom: '1rem' }}>
                {sortedDates.map((date) => (
                    <button
                        key={date}
                        className={selectedDate === date ? 'active' : ''}
                        onClick={() => setSelectedDate(date)}
                        style={{
                            marginRight: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: selectedDate === date ? '#ccc' : '#eee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {date === format(new Date(), 'yyyy-MM-dd')
                            ? 'СЬОГОДНІ, ' + format(new Date(date), 'd MMMM', { locale: uk }).toUpperCase()
                            : format(new Date(date), 'd MMMM yyyy', { locale: uk }).toUpperCase()}
                    </button>
                ))}
            </div>

            {grouped[selectedDate] && (
                <MoviesView title="" movies={grouped[selectedDate]} loading={false} error={null} variant="session" />
            )}
        </div>
    );
};

export default SessionsPage;
