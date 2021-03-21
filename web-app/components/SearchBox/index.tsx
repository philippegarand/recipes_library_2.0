import React, { useEffect, useState } from 'react';
import { Chip, TextField, InputAdornment } from '@material-ui/core';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { Icon } from '..';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { ACTION_ENUM, IStoreState } from '../../Utils/Store';
import { useDispatch, useSelector } from 'react-redux';
import { GetTags } from '../../api/calls';

const useStyles = makeStyles(() => ({
  clearIndicator: {
    color: 'white',
  },
}));

const CustomChip = withStyles({
  root: {
    backgroundColor: '#36b06f',
    color: '#fff',
    borderColor: '#000',
  },
})(Chip);

const filter = createFilterOptions();

export default function SearchBox() {
  const { selectedTags } = useSelector((state: IStoreState) => state);
  const classes = useStyles();
  const dispatch = useDispatch();

  const [tagOptions, setTagOptions] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [nbOfTags, setNbOfTag] = useState(0);
  const [canSearchByName, setCanSearchByName] = useState(true);

  const getPossibleTags = async () => {
    const res = await GetTags();
    setTagOptions(res.data);
  };

  useEffect(() => {
    getPossibleTags();
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, [width]);

  // useEffect(() => {
  //   if (width < 900) {
  //     setNbOfTag(1);
  //   } else {
  //     setNbOfTag(3);
  //   }
  // }, [width]);

  useEffect(() => {
    setCanSearchByName(!selectedTags.some((t) => t.Key === -1));
  }, [selectedTags]);

  const handleTagsChanged = (
    event: React.ChangeEvent<{}>,
    values: [],
  ) => {
    dispatch({
      type: ACTION_ENUM.SEARCH_BY_TAGS,
      selectedTags: values,
    });
  };

  return (
    <div>
      <Autocomplete
        multiple
        limitTags={nbOfTags}
        size="small"
        autoHighlight
        handleHomeEndKeys
        freeSolo
        classes={{
          clearIndicator: classes.clearIndicator,
        }}
        options={tagOptions}
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
          if (canSearchByName && params.inputValue !== '') {
            filtered.push({
              Key: -1,
              Value: params.inputValue,
              inputValue: `Rechercher par titre "${params.inputValue}"`,
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
            placeholder="Rechercher..."
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Icon icon="SearchIcon" customColor="white" />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
