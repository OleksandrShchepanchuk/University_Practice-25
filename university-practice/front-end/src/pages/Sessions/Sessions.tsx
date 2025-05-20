import { useEffect, useMemo, useState } from 'react';
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
        if (!hasLoaded && !loading && !error) {
            dispatch(loadSessions());
        }
    }, [dispatch, hasLoaded, loading, error]);

    const grouped = useMemo(() => {
        const result: Record<string, MovieWithSession[]> = {};
        const now = new Date();
        const currentDate = format(now, 'yyyy-MM-dd');
        const currentTime = format(now, 'HH:mm');

        sessions.forEach((session) => {
            const { date, times } = session.schedule;
            const movieId = session.movie?.id;
            const time = times;

            if (!time || !session.id || !movieId) return;

            if (date < currentDate) return;
            if (date === currentDate && time < currentTime) return;

            if (!result[date]) result[date] = [];

            const existing = result[date].find((m) => m.id === movieId);
            const timeObj = { time, sessionId: session.id };

            if (existing) {
                existing.schedule[0].times.push(timeObj);
            } else {
                result[date].push({
                    ...session.movie,
                    price: session.price,
                    schedule: [{ date, times: [timeObj] }],
                });
            }
        });

        return result;
    }, [sessions]);

    const sortedDates = useMemo(() => Object.keys(grouped).sort(), [grouped]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string>('');

    useEffect(() => {
        if (!selectedDate && sortedDates.length > 0) {
            setSelectedDate(sortedDates[0]);
        }
    }, [sortedDates, selectedDate]);

    const allTimes = grouped[selectedDate]?.flatMap((m) => m.schedule.flatMap((s) => s.times)) || [];

    const uniqueTimes = [...new Set(allTimes.map((t) => t.time))].sort();

    const uniqueGenres = [
        ...new Set(
            Object.values(grouped)
                .flat()
                .flatMap((m) => m.genre || []),
        ),
    ].sort();

    const formatDateLabel = (date: string) => {
        const parsed = parseISO(date);
        return date === format(new Date(), 'yyyy-MM-dd')
            ? 'СЬОГОДНІ'
            : format(parsed, 'd MMMM yyyy', { locale: uk }).toUpperCase();
    };

    const getFilteredMovies = (movies: MovieWithSession[]) => {
        if (!selectedGenre) return movies;
        return movies.filter((movie) => movie.genre?.includes(selectedGenre));
    };

    return (
        <div className={styles.main}>
            <div className={styles.background}></div>
            <div className={styles.page}>
                {/* {loading && <Loader />} */}
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
                                    <option key={date} value={date}>
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
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.selectArrow}>▼</div>
                            </div>
                        </div>
                    )}

                    <div className={styles.selectContainer}>
                        <div className={styles.selectWrapper}>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className={styles.genreSelect}
                            >
                                <option value="">Усі жанри</option>
                                {uniqueGenres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.selectArrow}>▼</div>
                        </div>
                    </div>
                </div>

                {grouped[selectedDate] && grouped[selectedDate].length > 0 ? (
                    <MoviesView
                        title=""
                        variant="session"
                        loading={false}
                        error={null}
                        movies={getFilteredMovies(grouped[selectedDate])
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
                    />
                ) : loading ? (<Loader/>) : (
                    <div className={styles.empty}>Сеансів не знайдено</div>
                )}
            </div>
        </div>
    );
};

export default Sessions;
