import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import moment from 'moment';

const styles = {
  card: {
    minWidth: 300,
  },
  source: {
    marginBottom: 12,
    fontSize: 14,
  },
  author: {
    marginBottom: 12,
  },
  point_time: {
    flexWrap: 'wrap',
  }
};

class HNItem extends React.Component {
  state = {
    raised: false,
  }
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}
        raised={this.state.raised}
        onMouseOver={() => this.setState({raised: true})}
        onMouseOut={() => this.setState({raised: false})}
      >
        <CardContent>
          <Typography className={classes.source}>
            {this.props.source}
          </Typography>
          {this.props.title !== undefined &&
            <Typography variant="headline" component="h2">
              {this.props.title}
            </Typography>
          }
          {this.props.author !== undefined &&
            <Typography className={classes.author} component="p">
              {this.props.author}
            </Typography>
          }
          <Grid container className={classes.point_time}>
            <Grid item xs>
              {this.props.score !== undefined &&
                <Typography component="p">
                  {this.props.score} points
                </Typography>
              }
            </Grid>
            <Grid item xs>
              {this.props.time !== undefined &&
                <Typography component="p">
                  {moment.unix(this.props.time).fromNow()}
                </Typography>
              }
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small" href={'https://news.ycombinator.com/item?id=' + this.props.id} target="_blank">
            {(() => { switch(this.props.comments) {
              case undefined:
              case 0: return 'discuss';
              case 1: return '1 comment';
              default: return this.props.comments + ' comments';
            }})()}
          </Button>
          {this.props.url !== undefined &&
            <Button size="small" href={this.props.url} target="_blank">
              visit url
            </Button>
          }
        </CardActions>
      </Card>
    );
  }
}

HNItem.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  title: PropTypes.string,
  score: PropTypes.number,
  author: PropTypes.string,
  time: PropTypes.number,
  url: PropTypes.string,
  comments: PropTypes.number,
};

export default withStyles(styles)(HNItem);