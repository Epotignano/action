import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {show} from 'universal/modules/notifications/ducks/notifications';
import {removeAuthToken} from 'universal/redux/authDuck';
import {withRouter} from 'react-router';

const logoutSuccess = {
  title: 'Tootles!',
  message: 'You\'ve been logged out successfully.',
  level: 'success'
};

@connect()
@withRouter
export default class LogoutContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    const {dispatch, router} = this.props;
    dispatch(removeAuthToken());
    router.replace('/');
    dispatch(show(logoutSuccess));
  }

  render() { return null; }
}
