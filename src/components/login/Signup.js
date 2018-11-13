import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as authActions from '../../actions/authActions';
import LoginForm from './LoginForm';
import toastr from 'toastr';

class SignUp extends React.Component{
	constructor(props, context){
		super(props, context);

		this.state = {
			userId: "",
			password: "",
			confirm: "",
      errorMsg: null,
      saving: false,
      redirect: false

		};

		this.onUserIdChange = this.onUserIdChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmChange = this.onConfirmChange.bind(this);
    this.signUp = this.signUp.bind(this);

	}

	onUserIdChange(event){
    const userId = event.target.value;
    return this.setState({userId: userId});

	}
	onPasswordChange(event){
    if(event.target.value === this.state.confirm){
      return this.setState({password: event.target.value, errorMsg: null});
    } else {
      this.setState({password: event.target.value, errorMsg: "Passwords do not match"});
    }
		const password = event.target.value;
    return this.setState({password: password});

	}
	onConfirmChange(event){
		if(event.target.value === this.state.password){
			this.setState({confirm: event.target.value, errorMsg: null});
		} else {
			this.setState({confirm: event.target.value, errorMsg: "Passwords do not match"});
		}
  }

  signUp(event){
    event.preventDefault();
    this.setState({saving: true});
    if(this.state.password !== this.state.confirm){
      toastr.error("Passwords do not match");
      this.setState({saving: false});
    } else {
      this.props.actions.signUp(this.state.userId, this.state.password)
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

  }


	render() {
    if (this.state.redirect) {
      return(
        <Redirect to="/"/>
      );
    }
		return (
				<LoginForm
						userId={this.state.userId}
						onUserIdChange={this.onUserIdChange}
						password={this.state.password}
						onPasswordChange={this.onPasswordChange}
						confirm={this.state.confirm}
						onConfirmChange={this.onConfirmChange}
						onSubmit={this.signUp}
            error ={this.state.errorMsg}
            saving={this.state.saving}
				/>
		);
	}
}

SignUp.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
