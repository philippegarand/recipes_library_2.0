import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Card,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Icon, IconButton } from '..';
import { FormikErrors, useFormik } from 'formik';
import styles from './Comments.module.css';
import { SEVERITY_ENUM } from '../../Utils/enums';
import { useDispatch } from 'react-redux';
import { ACTION_ENUM } from '../../Utils/Store';
import moment from 'moment-timezone';
import { IComment } from '../../Utils/types';
import { AddComment } from '../../api/calls';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  item: {
    padding: 0,
  },
}));

interface FormValue {
  comment: string;
}

interface IProps {
  comments: IComment[];
  recipeId: number;
  className?: any;
}

export default function Comments(props: IProps) {
  const { comments: commentsProps, recipeId, className } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [comments, setComments] = useState<IComment[]>([]);
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const commentRef = useRef(null);

  useEffect(() => {
    setComments(commentsProps);
  }, [commentsProps]);

  const validate = (values: FormValue) => {
    const errors: FormikErrors<FormValue> = {};

    if (!values.comment.length)
      errors.comment = 'Le commentaire ne peut pas être vide';

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values: FormValue) => {
      const res = await AddComment(recipeId, values.comment);

      if (!res.success) {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.ERROR,
          message: 'Une erreur est survenue',
        });
        return;
      }

      formik.resetForm();
      setIsCommenting(false);
      setComments([
        {
          id: res.data.id,
          text: res.data.text,
          commentedOn: res.data.commentedOn,
        },
        ...comments,
      ]);
    },
  });

  const handleAddNewComment = () => {
    commentRef.current.scrollIntoView();
    setIsCommenting(true);
  };

  const handleClear = () => {
    formik.resetForm();
    setIsCommenting(false);
  };

  return (
    <div className={className} ref={commentRef}>
      <div className={styles.title} onClick={handleAddNewComment}>
        <div className={styles.commentIcon}>
          <Icon
            icon="CommentIcon"
            className={styles.titleText}
            customColor="#353535"
          />
        </div>
        <Typography variant="h5">{`COMMENTAIRES (${
          comments?.length || 0
        })`}</Typography>
        <IconButton
          className={styles.btnAdd}
          icon="AddCircleIcon"
          style={{ color: '#353535' }}
        />
      </div>
      <Divider />

      <List dense disablePadding>
        {isCommenting && (
          <Card className={styles.newCommentCard}>
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.addComment}>
                <TextField
                  id="comment"
                  name="comment"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors['comment'])}
                  helperText={formik.errors['comment']}
                  value={formik.values['comment']}
                  placeholder="Commentaire..."
                  multiline
                  autoFocus
                  fullWidth
                />
                <IconButton
                  icon="SendIcon"
                  type="submit"
                  style={{ color: '#3CC47C', marginLeft: 'auto' }}
                />
                <IconButton
                  icon="CancelIcon"
                  onClick={handleClear}
                  style={{ color: '#ff3d47' }}
                />
              </div>
            </form>
          </Card>
        )}
        {comments?.map((comment) => (
          <div key={comment.id}>
            <ListItem
              classes={{ root: classes.item }}
              alignItems="flex-start"
            >
              <ListItemAvatar className={styles.listItemAvatar}>
                <Avatar className={styles.avatar} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primary={comment.text}
                secondary={moment(comment.commentedOn)
                  .tz('America/New_York')
                  .format('DD/MM/YYYY')}
              />
            </ListItem>
            <Divider className={styles.divider} />
          </div>
        ))}
      </List>
    </div>
  );
}
