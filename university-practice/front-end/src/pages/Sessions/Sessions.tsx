import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { loadSessions } from '../../store/slices/sessionsSlice';
import MoviesView from '../../components/Movies/MoviesView/MoviesView';
import { MovieWithSession } from '../../types/movie';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import styles from './Sessions.module.scss';
import Loader from '../../components/common/Loader/Loader';

const Sessions = () => {
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
        if (!time || !session.id) return;

        if (!grouped[date]) grouped[date] = [];

        const existingMovie = grouped[date].find((item) => item.id === movieId);

        const sessionTimeObj = { time, sessionId: session.id };

        if (existingMovie) {
            existingMovie.schedule[0].times.push(sessionTimeObj);
        } else {
            grouped[date].push({
                ...session.movie,
                price: session.price,
                schedule: [
                    {
                        date,
                        times: [sessionTimeObj],
                    },
                ],
            });
        }
    });

    const sortedDates = Object.keys(grouped).sort();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const allTimes = grouped[selectedDate]?.flatMap((movie) => movie.schedule.flatMap((sched) => sched.times)) || [];

    const uniqueTimes = [...new Set(allTimes)].sort();

    const formatDateLabel = (date: string) => {
        const parsedDate = parseISO(date);
        return date === format(new Date(), 'yyyy-MM-dd')
            ? 'СЬОГОДНІ'
            : format(parsedDate, 'd MMMM yyyy', { locale: uk }).toUpperCase();
    };

    return (
        <div className={styles.main}>
            <div className={styles.background}></div>
            <div className={styles.page}>
                {loading && <Loader />}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className={styles.controls}>
                    <div className={styles.selectContainer}>
                        <div className={styles.selectWrapper}>
                            <select
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedTime(null);
                                }}
                                className={styles.dateSelect}
                            >
                                {sortedDates.map((date) => (
                                    <option className={styles.dataOption} key={date} value={date}>
                                        {formatDateLabel(date)}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.selectArrow}>▼</div>
                        </div>
                    </div>

                    {uniqueTimes.length > 0 && (
                        <div className={styles.selectContainer}>
                            <div className={styles.selectWrapper}>
                                <select
                                    value={selectedTime || ''}
                                    onChange={(e) => setSelectedTime(e.target.value || null)}
                                    className={styles.timeSelect}
                                >
                                    <option value="">Увесь день</option>
                                    {uniqueTimes.map((time) => (
                                        <option key={time.time} value={time.time}>
                                            {time.time}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.selectArrow}>▼</div>
                            </div>
                        </div>
                    )}
                </div>

                {grouped[selectedDate] && (
                    <MoviesView
                        title=""
                        movies={grouped[selectedDate]
                            .map((movie) => ({
                                ...movie,
                                schedule: selectedTime
                                    ? movie.schedule
                                          .map((sched) => ({
                                              ...sched,
                                              times: sched.times.filter((time) => time.time === selectedTime),
                                          }))
                                          .filter((sched) => sched.times.length > 0)
                                    : movie.schedule,
                            }))
                            .filter((movie) => movie.schedule.length > 0)}
                        loading={false}
                        error={null}
                        variant="session"
                    />
                )}
            </div>
        </div>
    );
};

export default Sessions;
