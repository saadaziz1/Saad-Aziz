import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation, useSignupMutation } from '../services/authApi';
import { api } from '../store/api';
import { setCredentials, logout as logoutAction } from '../store/authSlice';
import { RootState } from '../store';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [loginMutation, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
    const [signupMutation, { isLoading: isSignupLoading, error: signupError }] = useSignupMutation();

    const login = async (credentials: any) => {
        try {
            const user = await loginMutation(credentials).unwrap();
            dispatch(setCredentials({ token: user.token }));
            return user;
        } catch (err) {
            throw err;
        }
    };

    const signup = async (data: any) => {
        try {
            const user = await signupMutation(data).unwrap();
            dispatch(setCredentials({ token: user.token }));
            return user;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        dispatch(logoutAction());
        dispatch(api.util.resetApiState());
        localStorage.removeItem('sessionId');
        router.push('/login');
    };

    return {
        login,
        signup,
        logout,
        isAuthenticated,
        token,
        isLoading: isLoginLoading || isSignupLoading,
        error: loginError || signupError,
    };
};
