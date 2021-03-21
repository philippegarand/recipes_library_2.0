import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { IStoreState } from '../../Utils/Store';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    snackbarDuration,
  } = useSelector((state: IStoreState) => state.snackbar);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      snackbarOpen ||
      Boolean(snackbarMessage || snackbarSeverity)
    ) {
      setOpen(true);
    }
  }, [snackbarOpen, snackbarMessage, snackbarSeverity]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={snackbarDuration || 4000}
      onClose={handleClose}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={snackbarSeverity}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}
