import React from "react";
import firebase from "../../firebase";
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

class Login extends React.Component {
	state = {
		email: "",
		password: "",
		errors: [],
		loading: false
	};
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	displayErrors = errors =>
		errors.map((error, i) => <p key={i}> {error.message} </p>);

	handleInputError = input => {
		return this.state.errors.some(error =>
			error.message.toLowerCase().includes(input)
		)
			? "error"
			: "";
	};

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.setState({ errors: [], loading: true });
			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then(signedInUser => {
					console.log(signedInUser);
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

	isFormValid = ({ email, password }) => {
		if (email !== "" && password !== "") return true;
		return false;
	};

	render() {
		const { email, password, errors, loading } = this.state;

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
							<Button
								disabled={loading}
								className={loading ? "loading" : ""}
								color='blue'
								fluid
								size='large'
							>
								Login
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>Error</h3> {this.displayErrors(errors)}
						</Message>
					)}
					<Message>
						New user? <Link to='/register'> Register!</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Login;
