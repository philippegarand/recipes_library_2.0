import React, { useEffect, useState } from 'react';
import {
  AppBar,
  fade,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Icon, IconButton } from '../';
import { FILTER_BY_ENUM, ROUTES } from '../../Utils/enums';
import SearchBox from '../SearchBox';
import { ACTION_ENUM, IStoreState } from '../../Utils/Store';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '../AlertDialog';
import { iconsList } from '../Icon';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  libraryButton: {
    marginRight: '0.5rem',
  },
  title: {
    display: 'none',
    flexGrow: 0.5,
    color: '#FFFFFF',
    overflow: 'clip',
    marginRight: '0.5rem',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: '0.25rem',
    backgroundColor: fade('#fff', 0.15),
    '&:hover': {
      backgroundColor: fade('#fff', 0.25),
    },
    marginLeft: 'auto',
    width: '100%',
    maxWidth: '32rem',
    flexGrow: 1,
  },
  editIcon: {
    marginLeft: 'auto',
  },
}));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const AppBarNameMap = new Map([
  [ROUTES.HOME, 'Menu principal'],
  [ROUTES.LIBRARY, 'Bibliothèque'],
  [`${ROUTES.RECIPE}/[id]`, 'Recette'],
  [ROUTES.IMPORT_RECIPE, 'Importer une recette'],
  [ROUTES.NOT_FOUND, 'Êtes-vous perdu ?'],
]);

const options: {
  icon: keyof typeof iconsList;
  text: string;
  filterBy: FILTER_BY_ENUM;
}[] = [
  {
    icon: 'ClearIcon',
    text: 'Aucun',
    filterBy: FILTER_BY_ENUM.NONE,
  },
  {
    icon: 'SortByAlphaIcon',
    text: 'A-Z',
    filterBy: FILTER_BY_ENUM.ALPHA_ORDER,
  },
  {
    icon: 'SortByAlphaIcon',
    text: 'Z-A',
    filterBy: FILTER_BY_ENUM.ALPHA_INORDER,
  },
  {
    icon: 'AlarmIcon',
    text: 'Temps',
    filterBy: FILTER_BY_ENUM.TIME,
  },
  {
    icon: 'StarIcon',
    text: 'Note',
    filterBy: FILTER_BY_ENUM.RATING,
  },
  {
    icon: 'FavoriteIcon',
    text: 'Favoris',
    filterBy: FILTER_BY_ENUM.FAVORITE,
  },
];

export default function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const { editMode } = useSelector((state: IStoreState) => state);

  const [currentPath, setCurrentPath] = useState(ROUTES.HOME);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const isMenuOpen = Boolean(anchorEl);

  const handleFilterMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'filter-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {options.map((option, index) => (
        <StyledMenuItem
          key={index}
          selected={index === selectedMenuIndex}
          onClick={() => {
            setSelectedMenuIndex(index);
            dispatch({
              type: ACTION_ENUM.FILTER_BY,
              filterBy: option.filterBy,
            });
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Icon icon={option.icon} />
          </ListItemIcon>
          <ListItemText primary={option.text} />
        </StyledMenuItem>
      ))}
    </Menu>
  );

  useEffect(() => {
    setCurrentPath(
      // @ts-ignore
      router.pathname.startsWith('/recipe/')
        ? ROUTES.RECIPE
        : router.pathname,
    );
  }, [router.pathname]);

  const handleEditModeChange = () => {
    dispatch({
      type: ACTION_ENUM.EDIT_MODE,
      editMode: !editMode,
    });
  };

  return (
    <div style={{ width: '100vw' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.libraryButton}
            icon="MenuBookIcon"
            onClick={() => router.push(ROUTES.HOME)}
          />
          <Typography
            className={classes.title}
            color="inherit"
            variant="h6"
            noWrap
          >
            {AppBarNameMap.get(currentPath)}
          </Typography>
          {
            currentPath === ROUTES.LIBRARY ? (
              <>
                <div className={classes.search}>
                  <SearchBox />
                </div>
                <div style={{ marginLeft: '0.375rem' }}>
                  <IconButton
                    edge="end"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleFilterMenuOpen}
                    color="inherit"
                    icon="FilterListIcon"
                  />
                </div>
              </>
            ) : currentPath === `${ROUTES.RECIPE}/[id]` ? (
              editMode ? null : (
                <IconButton
                  className={classes.editIcon}
                  edge="start"
                  icon="EditIcon"
                  onClick={handleEditModeChange}
                />
              )
            ) : currentPath === ROUTES.IMPORT_RECIPE ? null : null // /> //   icon="HelpOutlineIcon" //   edge="start" // <IconButton
          }
        </Toolbar>
      </AppBar>
      {currentPath === ROUTES.LIBRARY && renderMenu}
    </div>
  );
}
