import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadSessions } from '../store/slices/sessionsSlice';
import MoviesView from '../components/Movies/MoviesView/MoviesView';
import { MovieWithSession } from '../types/movie';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const SessionsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: sessions, loading, error, hasLoaded } = useSelector((state: RootState) => state.sessions);

    useEffect(() => {
        // if (!hasLoaded) dispatch(loadSessions());
    }, [dispatch, hasLoaded]);

    // Group sessions by date
    const grouped: Record<string, MovieWithSession[]> = {};
    sessions.forEach((session) => {
        session.schedule.forEach((sched) => {
            const key = sched.date;
            if (!grouped[key]) grouped[key] = [];

            grouped[key].push({
                ...session.movie,
                price: session.price,
                schedule: [sched],
            });
            console.log('session', grouped);
        });
    });
    console.log(grouped);

    const sortedDates = Object.keys(grouped).sort();

    return (
        <div className="grouped-sessions-page">
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {sortedDates.map((date) => (
                <div key={date} className="grouped-sessions-page__group">
                    <h2 className="grouped-sessions-page__date">
                        {date === format(new Date(), 'yyyy-MM-dd')
                            ? 'СЬОГОДНІ, ' + format(new Date(date), 'd MMMM', { locale: uk }).toUpperCase()
                            : format(new Date(date), 'd MMMM yyyy', { locale: uk }).toUpperCase()}
                    </h2>

                    <MoviesView
                        title="" // disable internal heading
                        movies={grouped[date]}
                        loading={false}
                        error={null}
                        variant="session"
                    />
                </div>
            ))}
        </div>
    );
};

export default SessionsPage;
