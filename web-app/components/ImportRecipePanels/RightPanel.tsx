import { FormikProps } from 'formik';
import React from 'react';
import { ITag } from '../../Utils/types';
import EditTags from '../EditRecipeInfos/EditTags';

import styles from './Panels.module.css';

export default function RightPanel(props: {
  formik: FormikProps<{ tags: ITag[] }>;
}) {
  const { formik } = props;

  return <EditTags className={styles.tags} formik={formik} />;
}
