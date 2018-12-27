import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Fab, LinearProgress, CircularProgress } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import Snackbar from '@material-ui/core/Snackbar';
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

class ItemList extends React.Component {
  state = {
    errorSnackbarOpen: false
  }

  componentDidMount() {
    this.setState({ errorSnackbarOpen: this.props.error});
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100) &&
      this.props.status === 'idle' &&
      this.props.itemList.length > 0
    ) {
      this.props.loadEnd();
    }
  }

  onErrorSnackbarClose = () => {
    this.setState({ errorSnackbarOpen: false });
  }

  render() {
    const { classes, status, itemList, loadFront } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.errorSnackbarOpen}
          autoHideDuration={1000}
          onClose={this.onErrorSnackbarClose}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id="message-id">Oops! Something bad happened...</span>}
        />
        <LinearProgress color="secondary" hidden={status !== 'loadFront'}/>
        <div style={{ padding: 24 }}>
          <Grid container className={classes.grid} spacing={24}>
            {itemList.map((item, i) => (
              <Grid item xs key={i}>
                <HNItem {...item} />
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
          <CircularProgress style={status === 'loadEnd' ? {} : {display: 'none'}} />
        </div>
        <Fab
          className={classes.fab}
          color='secondary'
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
            if (status === 'idle') {
              loadFront();
            }
          }}
        >
          <RefreshIcon />
        </Fab>
      </div>
    );
  }
}

ItemList.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  itemList: PropTypes.array.isRequired,
  loadFront: PropTypes.func.isRequired,
  loadEnd: PropTypes.func.isRequired
};

export default withStyles(styles)(ItemList);