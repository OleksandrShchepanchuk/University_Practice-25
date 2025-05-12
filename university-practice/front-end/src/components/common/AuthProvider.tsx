import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { setUser, clearUser } from '../../store/slices/usersSlice';

type Props = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
    const [authChecked, setAuthChecked] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                dispatch(
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                    }),
                );
            } else {
                dispatch(clearUser());
            }
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, [dispatch]);

    if (!authChecked) {
        return <div>Loading...</div>; // You can use a Spinner or Skeleton here
    }

    return <>{children}</>;
};

export default AuthProvider;
