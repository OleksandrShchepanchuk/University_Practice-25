import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSessions } from '../store/slices/sessionsSlice';
import type { AppDispatch, RootState } from '../store';

const SessionsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list: sessions, loading } = useSelector((state: RootState) => state.sessions);

    useEffect(() => {
        dispatch(loadSessions());
    }, [dispatch]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Sessions</h1>
            {loading && <p>Loading...</p>}
            <pre>{JSON.stringify(sessions, null, 2)}</pre>
        </div>
    );
};

export default SessionsPage;
