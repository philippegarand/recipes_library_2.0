import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
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
import { Icon, IconButton } from '../';
import { useFormik } from 'formik';
import styles from './Comments.module.css';
//import api from '../../helper/api';
import { SEVERITY_ENUM } from '../../Utils/enums';
import { useDispatch } from 'react-redux';
import { ACTION_ENUM } from '../../Utils/Store';
import { apiResponseIsError } from '../../Utils/validationFunctions';
import moment from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  item: {
    padding: 0,
  },
}));

export default function Comments(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { comments: commentsProps, recipeId } = props;
  const [comments, setComments] = useState([]);
  const [isCommenting, setIsCommenting] = useState(false);

  const commentRef = useRef(null);

  useEffect(() => {
    setComments(commentsProps);
  }, [commentsProps]);

  const validate = (values) => {
    const { comment } = values;
    const errors = {};
    if (!comment.length) {
      errors.comment = 'Le commentaire ne peut pas être vide';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      // const { comment } = values;
      // const { data, status } = await api('/api/DB/addComment', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     RecipeId: Number(recipeId),
      //     Content: comment,
      //   }),
      // });
      // if (apiResponseIsError(status)) {
      //   dispatch({
      //     type: ACTION_ENUM.SNACKBAR,
      //     severity: SEVERITY_ENUM.ERROR,
      //     message: 'Une erreur est survenue',
      //   });
      //   return;
      // }
      // formik.resetForm();
      // setIsCommenting(false);
      // setComments([
      //   {
      //     id: data,
      //     recipeId: Number(recipeId),
      //     content: comment,
      //     commentedOn: moment().toDate().toUTCString(),
      //   },
      //   ...comments,
      // ]);
    },
  });

  const handleAddNewComment = () => {
    commentRef.current.scrollIntoView();
    setIsCommenting(true);
  };

  const handleCommentChange = (event, ...args) => {
    formik.handleChange(event, ...args);
  };

  const handleClear = () => {
    formik.resetForm();
    setIsCommenting(false);
  };

  return (
    <div ref={commentRef}>
      <div className={styles.title} onClick={handleAddNewComment}>
        <div className={styles.commentIcon}>
          <Icon
            icon="CommentIcon"
            style={{ paddingTop: 4 }}
            customColor="#353535"
          />
        </div>
        <Typography
          component="div"
          className={styles.titleText}
          style={{ paddingTop: 4 }}
        >
          <Box fontWeight={400}>{`COMMENTAIRES (${
            comments?.length || 0
          })`}</Box>
        </Typography>
        <IconButton
          className={styles.btnAdd}
          icon="AddCircleIcon"
          style={{ color: '#353535' }}
        />
      </div>
      <Divider />

      <List dense disablePadding>
        {isCommenting ? (
          <Card className={styles.newCommentCard}>
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.addComment}>
                <TextField
                  id="comment"
                  name="comment"
                  onChange={handleCommentChange}
                  error={Boolean(formik.errors['comment'])}
                  helperText={formik.errors['comment']}
                  value={formik.values['comment']}
                  placeholder="Commentaire..."
                  multiline
                  autoFocus
                  style={{ width: '100%' }}
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
        ) : (
          <></>
        )}
        {comments?.map((comment) => (
          <div key={comment.id}>
            <ListItem
              classes={{ root: classes.item }}
              alignItems="flex-start"
            >
              <ListItemAvatar style={{ maxWidth: '20px' }}>
                <Avatar
                  variant="rounded"
                  style={{
                    backgroundColor: '#3CC47C',
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={comment.content}
                secondary={moment(comment.commentedOn)
                  .tz('America/New_York')
                  .format('DD/MM/YYYY')}
              />
            </ListItem>
            <Divider style={{ marginTop: 4, marginBottom: 4 }} />
          </div>
        ))}
      </List>
    </div>
  );
}
