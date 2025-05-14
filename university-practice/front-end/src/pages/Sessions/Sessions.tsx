import React from 'react';
import styles from './Sessions.module.scss';
import type { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import MoviesView from '../../components/Movies/MoviesView/MoviesView';
import { useSelector } from 'react-redux';
import { MovieWithSession } from '../../types/movie';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { loadSessions } from '../../store/slices/sessionsSlice';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Sessions = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { list: sessions, loading, error, hasLoaded } = useSelector((state: RootState) => state.sessions);
      const { isAuthenticated } = useAuth();

      useEffect(() => {
          if (!hasLoaded && !loading && isAuthenticated) {
              dispatch(loadSessions());
          }
      });

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
        });
    });

    const sortedDates = Object.keys(grouped).sort();
    return (
        <div className={styles.main}>
            <div className={styles.background}></div>
            <div className={styles.page}>
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
                        title=""
                        movies={grouped[date]}
                        loading={false}
                        error={null}
                        variant="session"
                    />
                </div>
            ))}
            </div>
        </div>
    );
};

export default Sessions;
