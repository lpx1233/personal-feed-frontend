import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HNItem from './HNItem';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';

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
const APPEND_ITEMS = 'my-personal-feed/feed/APPEND_ITEM';

const mochHNItem = {
  id: 17977698,
  source: 'Hacker News',
  title: 'Yarn Plug\'n\'Play: Getting rid of node_modules',
  point: 213,
  author: 'Couto',
  time: '4 hours ago',
  url: 'https://github.com/yarnpkg/rfcs/pull/101',
  comments: 2,
};

const initialState = {
  itemList: [mochHNItem],
};

function appendItems(items) {
  return { type: APPEND_ITEMS, items };
}

export function feedReducer(state = initialState, action) {
  switch (action.type) {
    case APPEND_ITEMS:
      return Object.assign({}, state, {
        itemList: [...state.itemList, ...action.items],
      });
    default:
      return state;
  }
}

// container component generation with react-redux
function mapStateToProps(state) {
  return {
    itemList: state.feed.itemList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appendItems: (items) => dispatch(appendItems(items)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedWithStyle);