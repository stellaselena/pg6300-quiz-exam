import React from 'react';
import LoginForm from "./LoginForm";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as authActions from '../../actions/authActions';
import toastr from 'toastr';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: "",
			password: "",
			errorMsg: null,
			saving: false,
			redirect: false

		};

		this.onUserIdChange = this.onUserIdChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.login = this.login.bind(this);

	}

	onUserIdChange(event){
    const userId = event.target.value;
    return this.setState({userId: userId});

	}
	onPasswordChange(event){
		const password = event.target.value;
    return this.setState({password: password});

	}

	login(event){
    event.preventDefault();
    this.setState({saving: true});
    this.props.actions.login(this.state.userId, this.state.password)
      .then((response) => {
        if(response == 204){
          this.setState({saving: false, redirect: true});
					toastr.success('Signed in as ' + this.state.userId);
        } else toastr.error("Something went wrong");})
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

	render() {
		if (this.state.redirect) {
      return <Redirect to="/" />;
    }
		return (
				<LoginForm
						userId={this.state.userId}
						onUserIdChange={this.onUserIdChange}
						password={this.state.password}
						onPasswordChange={this.onPasswordChange}
						onSubmit={this.login}
						error ={this.state.errorMsg}
				/>
		);
	}
}

Login.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    userId: state.auth.userId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
