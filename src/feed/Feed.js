import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { map, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Grid, Button, LinearProgress, CircularProgress } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { connect } from 'react-redux';
import HNItem from './HNItem';
import { fetchTopStories, fetchItemsByIds } from '../services/backend';

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
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
      this.props.status === 'idle' &&
      this.props.itemList.length > 0
    ) {
      this.props.loadMore();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <LinearProgress color="secondary" hidden={this.props.status !== 'refreshing'}/>
        <div style={{ padding: 24 }}>
          <Grid container className={classes.grid} spacing={24}>
            {this.renderItems(this.props.itemList)}
          </Grid>
        </div>
        <div style={{
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <CircularProgress
            style={this.props.status !== 'loading_more' ? {display: 'none'} : {}} />
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
            if (this.props.status === 'idle') {
              this.props.refresh();
            }
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
const REFRESH = 'my-personal-feed/feed/REFRESH';
const LOAD_MORE = 'my-personal-feed/feed/LOAD_MORE';

const initialState = {
  itemList: [],
  topStories: [],
  status: 'idle',
  currIdx: 0,
};

export function addItems(items, appendToEnd = false, clearPrevious = false, currIdx = 0) {
  return { type: ADD_ITEMS, items, appendToEnd, clearPrevious, currIdx };
}

export function setTopStories(topStories) {
  return { type: SET_TOP_STORIES, topStories};
}

function refresh() {
  return { type: REFRESH };
}

function loadMore() {
  return { type: LOAD_MORE };
}

export const refreshEpic = action$ => action$.pipe(
  ofType(REFRESH),
  map(() => fetchTopStories())
);

export const loadMoreEpic = (action$, state$) => action$.pipe(
  ofType(LOAD_MORE),
  withLatestFrom(state$),
  map(([, state]) => state.feed),
  map(state => fetchItemsByIds(
    state.topStories.slice(state.currIdx, state.currIdx + 10),
    { appendToEnd: true, clearPrevious: false, currIdx: state.currIdx + 10 }
  )),
);

export const setTopStoriesEpic = action$ => action$.pipe(
  ofType(SET_TOP_STORIES),
  map(action => fetchItemsByIds(
    action.topStories.slice(0, 10),
    { appendToEnd: false, clearPrevious: true, currIdx: 10 }
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
        status: 'idle',
        currIdx: action.currIdx,
      });
    case SET_TOP_STORIES:
      return Object.assign({}, state, {
        topStories: action.topStories,
      });
    case REFRESH:
      return Object.assign({}, state, {
        status: 'refreshing',
      });
    case LOAD_MORE:
      return Object.assign({}, state, {
        status: 'loading_more',
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
    status: state.feed.status,
    currIdx: state.feed.currIdx,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appendItems: (items) => dispatch(addItems(items)),
    setTopStories: (topStories) => dispatch(setTopStories(topStories)),
    refresh: () => dispatch(refresh()),
    loadMore: () => dispatch(loadMore()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedWithStyle);