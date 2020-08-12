import React from "react";
import firebase from "../../firebase";
import md5 from "md5";
import {
	Grid,
	Form,
	Segment,
	Button,
	Header,
	Message,
	Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
	state = {
		username: "",
		email: "",
		password: "",
		passwordConfirmation: "",
		errors: [],
		loading: false,
		usersRef: firebase.database().ref("users")
	};
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	displayErrors = errors =>
		errors.map((error, i) => <p key={i}> {error.message} </p>);

	isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
		return (
			!username.length ||
			!email.length ||
			!password.length ||
			!passwordConfirmation.length
		);
	};

	isPasswordValid = ({ password, passwordConfirmation }) => {
		if (password.length < 6 || passwordConfirmation.length < 6) {
			return false;
		} else if (password !== passwordConfirmation) {
			return false;
		} else {
			return true;
		}
	};

	isFormValid = () => {
		let errors = [];
		let error;
		if (this.isFormEmpty(this.state)) {
			//throw error
			error = { message: "Fill in all fields!" };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else if (!this.isPasswordValid(this.state)) {
			//throw error
			error = { message: "Passwords don't match!" };
			this.setState({ errors: errors.concat(error) });
			return false;
		} else {
			//valid form
			return true;
		}
	};

	handleInputError = input => {
		return this.state.errors.some(error =>
			error.message.toLowerCase().includes(input)
		)
			? "error"
			: "";
	};

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid()) {
			this.setState({ errors: [], loading: true });
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then(createdUser => {
					console.log(createdUser);
					createdUser.user
						.updateProfile({
							displayName: this.state.username,
							photoURL: `http://gravatar.com/avatar/${md5(
								createdUser.user.email
							)}?d=identicon`
						})
						.then(() => {
							this.saveUser(createdUser).then(() => {
								console.log("User saved!");
							});
							this.setState({ loading: false });
						})
						.catch(error => {
							console.error(error);
							this.setState({
								errors: this.state.errors.concat(error),
								loading: false
							});
						});
				})
				.catch(error => {
					console.error(error);
					this.setState({
						errors: this.state.errors.concat(error),
						loading: false
					});
				});
		}
	};

	saveUser = createdUser => {
		return this.state.usersRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL
		});
	};

	render() {
		const {
			username,
			email,
			password,
			passwordConfirmation,
			errors,
			loading
		} = this.state;

		return (
			<Grid textAlign='center' verticalAlign='middle' className='app'>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h1' icon color='blue' textAlign='center'>
						<Icon name='bell' color='blue' />
						{/* App name tbd */} VeryChat
					</Header>
					<Form size='large' onSubmit={this.handleSubmit}>
						<Segment stacked>
							<Form.Input
								fluid
								name='username'
								icon='user'
								iconPosition='left'
								placeholder='Username'
								type='text'
								value={username}
								onChange={this.handleChange}
							/>
							<Form.Input
								fluid
								name='email'
								icon='mail'
								iconPosition='left'
								placeholder='Email'
								type='email'
								value={email}
								onChange={this.handleChange}
								className={this.handleInputError("email")}
							/>
							<Form.Input
								fluid
								name='password'
								icon='lock'
								iconPosition='left'
								placeholder='Password'
								type='password'
								value={password}
								onChange={this.handleChange}
								className={this.handleInputError("password")}
							/>
							<Form.Input
								fluid
								name='passwordConfirmation'
								icon='check'
								iconPosition='left'
								placeholder='Confirm Password'
								type='password'
								value={passwordConfirmation}
								onChange={this.handleChange}
								className={this.handleInputError("password")}
							/>
							<Button
								disabled={loading}
								className={loading ? "loading" : ""}
								color='blue'
								fluid
								size='large'
							>
								Register
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>Error</h3> {this.displayErrors(errors)}
						</Message>
					)}
					<Message>
						Already a user? <Link to='/login'> Login</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Register;
