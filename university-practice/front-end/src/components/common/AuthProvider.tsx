import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { setUser, clearUser } from '../../store/slices/usersSlice';
import Loader from './Loader/Loader';
import firebase from 'firebase/compat/app';

type Props = {
    children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
    const [authChecked, setAuthChecked] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const { claims } = (await firebaseUser?.getIdTokenResult()) as any;
                const { roles } = claims;
                dispatch(
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        roles: roles || 'USER',
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
        return <Loader />;
    }

    return <>{children}</>;
};

export default AuthProvider;
