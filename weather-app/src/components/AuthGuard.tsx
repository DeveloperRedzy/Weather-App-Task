import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginThunk } from '../store/features/authSlice';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const authenticate = async () => {
      if (!token) {
        try {
          await dispatch(loginThunk()).unwrap();
        } catch (error) {
          console.error('Failed to authenticate:', error);
          navigate('/error');
        }
      }
    };

    authenticate();
  }, [dispatch, navigate, token]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <>{children}</>;
};
