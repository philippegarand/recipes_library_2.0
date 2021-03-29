import AddIcon from '@material-ui/icons/Add';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AlarmIcon from '@material-ui/icons/Alarm';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ClearIcon from '@material-ui/icons/Clear';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CommentIcon from '@material-ui/icons/Comment';
import EcoIcon from '@material-ui/icons/Eco';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FilterListIcon from '@material-ui/icons/FilterList';
import GroupIcon from '@material-ui/icons/Group';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RemoveIcon from '@material-ui/icons/IndeterminateCheckBox';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import ShareIcon from '@material-ui/icons/Share';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import StarIcon from '@material-ui/icons/Star';
import WhatshotIcon from '@material-ui/icons/Whatshot';

import { IconProps } from '@material-ui/core';

export const iconsList = {
  AddIcon,
  AddBoxIcon,
  AddCircleIcon,
  AlarmIcon,
  ArrowRightIcon,
  CancelIcon,
  CheckBoxOutlinedIcon,
  CheckBoxOutlineBlankIcon,
  CheckCircleIcon,
  CheckCircleOutlineIcon,
  ClearIcon,
  CloudUploadIcon,
  CommentIcon,
  EcoIcon,
  EditIcon,
  FavoriteBorderIcon,
  FavoriteIcon,
  FilterListIcon,
  GroupIcon,
  HelpOutlineIcon,
  HomeIcon,
  LibraryBooksIcon,
  MenuBookIcon,
  RemoveIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  SentimentVeryDissatisfiedIcon,
  ShareIcon,
  SortByAlphaIcon,
  StarIcon,
  WhatshotIcon,
};

interface IProps extends IconProps {
  icon: keyof typeof iconsList;
  className?: any;
  customColor?: string;
}

export default function Icon(props: IProps) {
  const { className, icon, customColor, ...otherProps } = props;

  const Icon = iconsList[icon];

  return (
    // @ts-ignore
    <Icon
      {...otherProps}
      className={className}
      style={{ fill: customColor }}
    />
  );
}
