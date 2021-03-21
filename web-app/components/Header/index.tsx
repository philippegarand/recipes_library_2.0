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
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    flexGrow: 1,
    color: '#FFFFFF',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '47%',
      flexGrow: 0,
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(1),
      width: '33%',
      flexGrow: 0,
    },
    flexGrow: 0.75,
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
  [ROUTES.RECIPE, 'Recette'],
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
  const [openAlert, setOpenAlert] = useState(false);

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

  // useEffect(() => {
  //   setCurrentPath(
  //     location.pathname.startsWith('/recipe/')
  //       ? ROUTES.RECIPE
  //       : location.pathname,
  //   );
  // }, [location.pathname]);

  const handleImportHelpOpen = () => {
    setOpenAlert(true);
  };
  const handleImportHelpClose = () => {
    setOpenAlert(false);
  };

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
          {currentPath === ROUTES.LIBRARY ? (
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
          ) : currentPath === ROUTES.RECIPE ? (
            editMode ? null : (
              <IconButton
                edge="start"
                icon="EditIcon"
                onClick={handleEditModeChange}
              />
            )
          ) : currentPath === ROUTES.IMPORT_RECIPE ? (
            <IconButton
              edge="start"
              icon="HelpOutlineIcon"
              onClick={() => handleImportHelpOpen()}
            />
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>

      {currentPath === ROUTES.LIBRARY && renderMenu}

      <AlertDialog
        title="Comment importer une recette?"
        content="
        1. Choisir une recette sous forme de fichier Png ou Jpg.\n
        2. Suivre les étapes inscrites au bas de l'écran.\n
        3. Pour sélectionner une zone sur l'image, utilisez la souris.\n
        4. Une fois sélectionnée, la zone peut être modifiée et déplacée à l'aide des flèches du clavier.\n
        5. Appuyez sur le boutton 'Accepter' ou 'Refuser' à côté de l'aperçu de l'image sélectionnée, ou utilisez les touches 'Y' ou 'N' pour confirmer la sélection.\n
        6. Assurez-vous qu'il n'y a pas de blanc autour de l'image dans l'apreçu.\n
        7. Lorsque toutes les informations sont entrées, appuyez sur 'Suivant' pour poursuivre."
        open={openAlert}
        handleClose={handleImportHelpClose}
      />
    </div>
  );
}
