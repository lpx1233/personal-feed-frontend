import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Grid, Button, LinearProgress } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { connect } from 'react-redux';
import HNItem from './HNItem';
import { fetchTopStories, fetchItemsByIds } from '../services/backend';
import { FETCH_TOP_STORIES } from '../services/backend';

// react UI part
const styles = theme => ({
  grid: {
    flexWrap: 'wrap',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    color: theme.palette.secondary,
  },
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
  
  componentDidMount() {
    this.props.refresh();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <LinearProgress color="secondary" hidden={!this.props.fetching}/>
        <div style={{ padding: 24 }}>
          <Grid container className={classes.grid} spacing={24}>
            {this.renderItems(this.props.itemList)}
          </Grid>
        </div>
        <Button
          variant="fab"
          className={classes.fab}
          color='secondary'
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
            this.props.refresh();
          }}
        >
          <RefreshIcon />
        </Button>
      </div>
    );
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
};

const FeedWithStyle = withStyles(styles)(Feed);

// redux logic part
const ADD_ITEMS = 'my-personal-feed/feed/ADD_ITEMS';
const SET_TOP_STORIES = 'my-personal-feed/feed/SET_TOP_STORIES';

const initialState = {
  itemList: [],
  topStories: [],
  fetching: false,
};

export function addItems(items, appendToEnd = false, clearPrevious = false) {
  return { type: ADD_ITEMS, items, appendToEnd, clearPrevious };
}

export function setTopStories(topStories) {
  return { type: SET_TOP_STORIES, topStories};
}

export const setTopStoriesEpic = action$ => action$.pipe(
  ofType(SET_TOP_STORIES),
  map(action => fetchItemsByIds(
    action.topStories.slice(0, 10),
    { appendToEnd: false, clearPrevious: true }
  )),
);

export function feedReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEMS:
      var itemList = action.clearPrevious ? [] : state.itemList;
      itemList = action.appendToEnd ?
        [...itemList, ...action.items] : [...action.items, ...itemList];
      return Object.assign({}, state, {
        itemList: itemList,
        fetching: false,
      });
    case SET_TOP_STORIES:
      return Object.assign({}, state, {
        topStories: action.topStories,
      });
    case FETCH_TOP_STORIES:
      return Object.assign({}, state, {
        fetching: true,
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
    fetching: state.feed.fetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appendItems: (items) => dispatch(addItems(items)),
    setTopStories: (topStories) => dispatch(setTopStories(topStories)),
    refresh: () => dispatch(fetchTopStories()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedWithStyle);