import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import HNItem from './HNItem';
import { fetchItemsByIds } from '../services/backend';

// react UI part
const styles = () => ({
  root: {
    flexWrap: 'wrap',
    padding: 24,
  }
});

class Feed extends React.Component {
  state = {
    
  };

  renderItems(itemList) {
    return itemList.map((item, i) => (
      <Grid item xs key={i}>
        <HNItem {...item} />
      </Grid>
    ));
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={24}>
        {this.renderItems(this.props.itemList)}
      </Grid>
    );
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
};

const FeedWithStyle = withStyles(styles)(Feed);

// redux logic part
const CLEAR_ITEMS = 'my-personal-feed/feed/CLEAR_ITEMS';
const APPEND_ITEMS = 'my-personal-feed/feed/APPEND_ITEM';
const SET_TOP_STORIES = 'my-personal-feed/feed/SET_TOP_STORIES';

// const mochHNItem = {
//   id: 17977698,
//   source: 'Hacker News',
//   title: 'Yarn Plug\'n\'Play: Getting rid of node_modules',
//   point: 213,
//   author: 'Couto',
//   time: 1536794872,
//   url: 'https://github.com/yarnpkg/rfcs/pull/101',
//   comments: 2,
// };

const initialState = {
  itemList: [],
  topStories: [],
};

export function clearItems() {
  return { type: CLEAR_ITEMS };
}

export function appendItems(items) {
  return { type: APPEND_ITEMS, items };
}

export function setTopStories(topStories) {
  return { type: SET_TOP_STORIES, topStories};
}

export const setTopStoriesEpic = action$ => action$.pipe(
  ofType(SET_TOP_STORIES),
  map(action => fetchItemsByIds(action.topStories.slice(0, 10))),
);

export function feedReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ITEMS:
      return Object.assign({}, state, {
        itemList: [],
      });
    case APPEND_ITEMS:
      return Object.assign({}, state, {
        itemList: [...state.itemList, ...action.items],
      });
    case SET_TOP_STORIES:
      return Object.assign({}, state, {
        topStories: action.topStories,
      });
    default:
      return state;
  }
}

// container component generation with react-redux
function mapStateToProps(state) {
  return {
    itemList: state.feed.itemList,
    topStories: state.feed.topStories,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearItems: () => dispatch(clearItems()),
    appendItems: (items) => dispatch(appendItems(items)),
    setTopStories: (topStories) => dispatch(setTopStories(topStories)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedWithStyle);