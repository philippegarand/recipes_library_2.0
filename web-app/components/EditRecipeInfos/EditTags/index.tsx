import React, { useEffect, useState } from 'react';
import { Chip, TextField, withStyles } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { apiResponseIsError } from '../../../Utils/validationFunctions';
import { ACTION_ENUM } from '../../../Utils/Store';
import { SEVERITY_ENUM } from '../../../Utils/enums';
import { FormikProps } from 'formik';
import { ITag } from '../../../Utils/types';
import { AddTag, GetTags } from '../../../api/calls';

const CustomChip = withStyles({
  root: {
    backgroundColor: '#3CC47C',
    color: '#fff',
    borderColor: '#000',
  },
})(Chip);

interface IAddableTag {
  id: number;
  text: string;
  display?: string;
}

interface IProps {
  formik: FormikProps<{ tags: ITag[] }>;
  className?: any;
  fullWidth?: boolean;
}

export default function EditTags(props: IProps) {
  const { className, formik, fullWidth = false } = props;
  const dispatch = useDispatch();
  const filter = createFilterOptions();

  const [tagOptions, setTagOptions] = useState<IAddableTag[]>([]);

  const getPossibleTags = async () => {
    const tags = await GetTags();
    // @ts-ignore
    setTagOptions(tags.data);
  };

  useEffect(() => {
    getPossibleTags();
  }, []);

  const handleTagsChanged = async (e: any, values: IAddableTag[]) => {
    if (values[values.length - 1]?.id === -1) {
      const newTag =
        values[values.length - 1].text.charAt(0).toUpperCase() +
        values[values.length - 1].text.slice(1);

      const res = await AddTag(newTag);
      console.log(res);

      if (apiResponseIsError(res.status)) {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.ERROR,
          message:
            'Une erreur est survenue, la catégorie existe peut-être déjà...',
        });
        return;
      }

      // successfully created
      const updatedList = values.filter((v) => v.id !== -1);
      formik.setFieldValue('tags', [
        ...updatedList,
        { id: res.data.tagId, text: res.data.content },
      ]);
      getPossibleTags();
      return;
    }

    formik.setFieldValue('tags', values);
  };

  //console.log(tagOptions);

  return (
    <Autocomplete
      className={className}
      multiple
      fullWidth={fullWidth}
      value={formik.values.tags}
      handleHomeEndKeys
      options={tagOptions}
      getOptionSelected={(option: ITag, value: ITag) =>
        option.id === value.id
      }
      getOptionLabel={(option: IAddableTag) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.display) {
          return option.display;
        }
        return option.text;
      }}
      filterOptions={(options: any, params: any) => {
        const filtered = filter(options, params);
        if (params.inputValue !== '') {
          filtered.push({
            id: -1,
            text: params.inputValue,
            display: `Ajouter catégorie "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      onChange={handleTagsChanged}
      renderTags={(values, getTagProps) =>
        values.map((option: ITag, index) => (
          <CustomChip
            key={index}
            label={option.text}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Catégories"
          placeholder="Écrivez ici..."
          fullWidth
        />
      )}
    />
  );
}
