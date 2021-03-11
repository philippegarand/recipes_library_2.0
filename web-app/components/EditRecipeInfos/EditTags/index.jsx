import React, { useEffect, useState } from 'react';
import { Chip, TextField, withStyles } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import api from '../../../helper/api';
import { formatRoute } from '../../../helper/goTo';
import { apiResponseIsError } from '../../../Utils/validationFunctions';
import { ACTION_ENUM } from '../../../Utils/Store';
import { SEVERITY_ENUM } from '../../../Utils/enums';

const CustomChip = withStyles({
  root: {
    backgroundColor: '#3CC47C',
    color: '#fff',
    borderColor: '#000',
  },
})(Chip);

/**
 *
 * @param formik formik with field 'tags'
 * @param className optional className to be applied
 * @param fullWidth optional
 */
export default function EditTags(props) {
  const { className, formik, fullWidth = false } = props;
  const dispatch = useDispatch();
  const filter = createFilterOptions();

  const [tagOptions, setTagOptions] = useState([]);

  const getPossibleTags = async () => {
    const data = await api(formatRoute('/api/DB/tags', null), {});
    setTagOptions(data);
  };

  useEffect(() => {
    getPossibleTags();
  }, []);

  const handleTagsChanged = async (e, values) => {
    if (values[values.length - 1]?.Key === -1) {
      const newTag =
        values[values.length - 1].Value.charAt(0).toUpperCase() +
        values[values.length - 1].Value.slice(1);

      const { data, status } = await api('/api/DB/addTag', {
        method: 'POST',
        body: JSON.stringify({
          Content: newTag,
        }),
      });

      if (apiResponseIsError(status)) {
        dispatch({
          type: ACTION_ENUM.SNACKBAR,
          severity: SEVERITY_ENUM.ERROR,
          message:
            'Une erreur est survenue, la catégorie existe peut-être déjà...',
        });
        return;
      }

      // successfully created
      const updatedList = values.filter((v) => v.Key !== -1);
      formik.setFieldValue('tags', [
        ...updatedList,
        { Key: data.tagId, Value: data.content },
      ]);
      getPossibleTags();
      return;
    }

    formik.setFieldValue('tags', values);
  };

  return (
    <Autocomplete
      className={className}
      multiple
      fullWidth={fullWidth}
      value={formik.values.tags}
      id="tags-outlined"
      handleHomeEndKeys
      options={tagOptions}
      getOptionSelected={(option, value) => option.Key === value.Key}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.Value;
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (params.inputValue !== '') {
          filtered.push({
            Key: -1,
            Value: params.inputValue,
            inputValue: `Ajouter catégorie "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      onChange={handleTagsChanged}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <CustomChip
            key={index}
            label={option.Value}
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
