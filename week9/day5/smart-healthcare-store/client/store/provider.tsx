'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';
import { useEffect } from 'react';
import { setCredentials } from './authSlice';

function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setCredentials({ token }));
        }
    }, [dispatch]);

    return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer />
            {children}
        </Provider>
    );
}
