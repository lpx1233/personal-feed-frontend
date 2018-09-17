import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HNItem from './HNItem';
import { Grid } from '@material-ui/core';

const styles = () => ({
  root: {
    flexWrap: 'wrap',
    padding: 24,
  }
});

class Feed extends React.Component {
  state = {
    
  };

  renderItems(num, item) {
    // TODO: use data from redux to render feed items
    return [...Array(num).keys()].map((i) => (
      <Grid item xs key={i}>
        <HNItem {...item} />
      </Grid>
    ));
  }

  render() {
    const { classes } = this.props;
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
    return (
      <Grid container className={classes.root} spacing={24}>
        {this.renderItems(5, mochHNItem)}
      </Grid>
    );
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Feed);