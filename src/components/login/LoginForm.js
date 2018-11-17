import React from 'react';
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import PropTypes from 'prop-types';

const LoginForm = ({confirm, onConfirmChange, password, onPasswordChange, userId, onUserIdChange, error, onSubmit}) => (
	<div className="container container-login-form">
				<form>
					<h1 className="text-center">{onConfirmChange ? "Sign up" : "Login"}</h1>
					<FormGroup controlId="username" bsSize="small">
						<ControlLabel>Username</ControlLabel>
						<FormControl
								type="text"
								placeholder="Username"
								value={userId}
								onChange={onUserIdChange}
						/>
					</FormGroup>
					<FormGroup controlId="password" bsSize="small">
						<ControlLabel>Password</ControlLabel>
						<FormControl
								type="password"
								placeholder="Password"
								value={password}
								onChange={onPasswordChange}
						/>
					</FormGroup>
					{onConfirmChange &&
						<FormGroup validation={getValidation(password, confirm)}
						controlId="confirm" bsSize="small">
							<ControlLabel>Confirm password</ControlLabel>
							<FormControl
							type="password"
							placeholder="Confirm password"
							value={confirm}
							onChange={onConfirmChange}
							/>
							<FormControl.Feedback />
						</FormGroup>
					}
					{error && <div><p className="bg-danger text-center">{error}</p></div> }
					<Button
							className="btn-primary"
							block
							bsSize="small"
							type="button"
							onClick={onSubmit}
					>
						{onConfirmChange ? "Register" : "Login"}
					</Button>
				</form>
			</div>
);

function getValidation(password, confirm) {
	if(password !== undefined && password !== null && password.length >= 1){
    if (confirm === password) return 'success';
    else if (confirm !== password) return 'error';
	} 
	return null;
}	


LoginForm.propTypes = {
	confirm: PropTypes.string,
	onConfirmChange: PropTypes.func,
	password: PropTypes.string.isRequired,
	onPasswordChange: PropTypes.func.isRequired,
	userId: PropTypes.string.isRequired,
	onUserIdChange: PropTypes.func.isRequired,
	error: PropTypes.string,
	onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
