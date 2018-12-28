import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import CloudIcon from '@material-ui/icons/Cloud';
import withWidth from '@material-ui/core/withWidth';
// import Feed from './feed/Feed';
import TopStories from './feed/TopStories';

const sideNavWidth = 275;

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
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sideNav: {
    width: sideNavWidth,
  },
  appBar: {
    marginLeft: sideNavWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${sideNavWidth}px)`,
    },
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
    const { classes, width } = this.props;
  
    const sideNavList = (
      <div>
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

    const getNav = (width) => {
      switch(width) {
        case 'xl':
        case 'lg':
        case 'md':
          return <Drawer
            classes={{
              paper: classes.sideNav,
            }}
            variant="permanent"
            open
          >
            {sideNavList}
          </Drawer>;
        default:
          return <SwipeableDrawer
            classes={{
              paper: classes.sideNav,
            }}
            open={this.state.sideNav}
            onClose={this.toggleDrawer(false)}
            onOpen={this.toggleDrawer(true)}
          >
            {sideNavList}
          </SwipeableDrawer>;
      }
    };

    const getActiveTab = (activeTab, width) => {
      var activeComp = <p>About Me</p>;
      switch(activeTab) {
        case 0:
          activeComp = <TopStories />;
          break;
        case 1:
          activeComp = <p>Recommended For You</p>;
          break;
        default:
          activeComp = <p>About Me</p>;
          break;
      }
      switch(width) {
        case 'xl':
        case 'lg':
          activeComp = <div style={{
            paddingTop: 64,
            paddingLeft: sideNavWidth,
            paddingRight: sideNavWidth,
          }}>
            {activeComp}
          </div>;
          break;
        case 'md':
          activeComp = <div style={{
            paddingTop: 64,
            paddingLeft: sideNavWidth,
          }}>
            {activeComp}
          </div>;
          break;
        default:
          activeComp = <div style={{ paddingTop: 64 }}>
            {activeComp}
          </div>;
          break;
      }
      return activeComp;
    };

    return (
      <div className={classes.root}>
        <nav>
          {getNav(width)}
        </nav>
        <AppBar position="fixed" className={classes.appBar}>
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
        {getActiveTab(this.state.activeTab, width)}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default withRoot(withStyles(styles)(withWidth()(App)));