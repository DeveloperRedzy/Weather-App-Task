import { FC } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { hideSnackbar } from '../store/features/uiSlice';

export const WeatherSnackbar: FC = () => {
  const dispatch = useAppDispatch();
  const { open, message, severity } = useAppSelector(
    (state) => state.ui.snackbar
  );

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant='filled'
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
