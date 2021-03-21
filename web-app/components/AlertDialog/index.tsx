import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Button } from '..';

interface Iprops {
  title: string;
  content?: string;
  open: boolean;
  yesNo?: boolean;
  handleClose: any;
  handleYes?: any;
}

export default function AlertDialog(props: Iprops) {
  const {
    title,
    content,
    open,
    handleClose,
    yesNo,
    handleYes,
  } = props;

  if (yesNo) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content?.split('\\n\r').map((text, index) => (
            <DialogContentText key={index}>{text}</DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleClose}
            style={{ color: '#C90E0E' }}
          >
            Non
          </Button>
          <Button
            variant="text"
            onClick={handleYes}
            style={{ color: '#3CC47C' }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content?.split('\\n\r').map((text, index) => (
            <DialogContentText key={index}>{text}</DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleClose}
            style={{ color: '#3CC47C' }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
