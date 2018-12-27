import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import CloudIcon from '@material-ui/icons/Cloud';
// import Feed from './feed/Feed';
import TopStories from './feed/TopStories';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  sideNav: {
    width: 300,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    paddingLeft: theme.spacing.unit * 3,
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

class App extends React.Component {
  state = {
    sideNav: false,
    activeTab: 0,
  };

  toggleDrawer = (open) => () => {
    this.setState({
      sideNav: open,
    });
  };

  render() {
    const { classes } = this.props;
  
    const sideNavList = (
      <div className={classes.sideNav}>
        <div className={classes.toolbar}>
          <Typography variant="h6" align="center">
            Personal Feed
          </Typography>
        </div>
        <Divider />
        <List>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            <ListItem
              button
              selected={this.state.activeTab === 0}
              onClick={() => this.setState({ activeTab: 0 })}
            >
              <ListItemIcon>
                <CloudIcon />
              </ListItemIcon>
              <ListItemText primary="Top Stories"/>
            </ListItem>
            <ListItem
              button
              selected={this.state.activeTab === 1}
              onClick={() => this.setState({ activeTab: 1 })}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Recommended For You"/>
            </ListItem>
            <ListItem
              button
              selected={this.state.activeTab === 2}
              onClick={() => this.setState({ activeTab: 2 })}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="About Me"/>
            </ListItem>
          </div>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <SwipeableDrawer
          open={this.state.sideNav}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
        >
          {sideNavList}
        </SwipeableDrawer>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              { this.state.activeTab === 0 && 'Top Stories' }
              { this.state.activeTab === 1 && 'Recommended For You' }
              { this.state.activeTab === 2 && 'About Me' }
            </Typography>
          </Toolbar>
        </AppBar>
        {
          // TODO: set up different page here, with routes 
          // Replace <Feed /> with <TopStories /> & <Recommended />
          // add tab state to local store
          // <Feed />
        }
        <div style={{ paddingTop: 56 }}>
          { this.state.activeTab === 0 && <TopStories /> }
          { this.state.activeTab === 1 && <p>Recommended For You</p> }
          { this.state.activeTab === 2 && <p>About Me</p> }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));