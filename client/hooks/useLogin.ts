import { useLoginMutation } from '@/libreduxservices/authApi';
import { useAppDispatch } from '@/libredux/hooks';
import { setCredentials } from '@/libreduxslices/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogin = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = async (data: any) => {
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials(response));
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return {
        handleLogin,
        isLoading
    };
};
