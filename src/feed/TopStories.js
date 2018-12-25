import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, LinearProgress, CircularProgress } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import HNItem from './HNItem';

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

class TopStories extends React.Component {
  propTypes = {
    classes: PropTypes.object.isRequired,
    networkStatus: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired,
    fetchMore: PropTypes.func.isRequired
  };
  
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
      (this.props.networkStatus == 7 || this.props.networkStatus == 8) &&
      this.props.data.topstories.length > 0
    ) {
      this.props.fetchMore({
        variables: {
          from: this.props.data.topstories.length,
          len: 10
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            topstories: [...prev.topstories, ...fetchMoreResult.topstories]
          });
        }
      });
    }
  }

  render() {
    const { classes, networkStatus, data, refetch } = this.props;
    return (
      <div>
        <LinearProgress color="secondary" hidden={
          !(networkStatus == 1 || networkStatus == 4)}/>
        <div style={{ padding: 24 }}>
          <Grid container className={classes.grid} spacing={24}>
            {data.topstories.map((item, i) => (
              <Grid item xs key={i}>
                <HNItem
                  id={item.id}
                  title={item.title}
                  score={item.score}
                  author={item.by}
                  time={item.time}
                  url={item.url}
                  comments={item.kids.length}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        <div style={{
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <CircularProgress
            style={networkStatus == 3 ? {} : {display: 'none'}} />
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
            if (networkStatus == 7 || networkStatus == 8) {
              refetch();
            }
          }}
        >
          <RefreshIcon />
        </Button>
      </div>
    );
  }
}

const TopStoriesWithStyle = withStyles(styles)(TopStories);

// Apollo Client part
const GET_TOP_STORIES = gql`
  query TopStories($from: Int!, $len: Int!) {
    topstories(from: $from, len: $len) {
      id
      title
      score
      by
      time
      kids
      url
    }
  }
`;

const TopStoriesWithQuery = () => (
  <Query
    query={GET_TOP_STORIES}
    variables={{ from: 0, len: 10 }}
    notifyOnNetworkStatusChange
  >
    {({ error, data, refetch, fetchMore, networkStatus }) => {
      // TODO: use snackbars to inform error
      if (error) ;
      return (
        <TopStoriesWithStyle
          networkStatus={networkStatus}
          data={data}
          refetch={refetch}
          fetchMore={fetchMore}/>
      );
    }}
  </Query>
);

export default TopStoriesWithQuery;