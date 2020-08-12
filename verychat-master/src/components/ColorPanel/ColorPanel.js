import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setColors } from "../../actions";

import { SliderPicker, SwatchesPicker } from "react-color";

import {
	Sidebar,
	Menu,
	Divider,
	Button,
	Modal,
	Icon,
	Label,
	Segment,
} from "semantic-ui-react";

class ColorPanel extends React.Component {
	state = {
		modal: false,
		primary: "",
		secondary: "",
		user: this.props.currentUser,
		usersRef: firebase.database().ref("users"),
		userColors: [],
	};

	componentDidMount() {
		if (this.state.user) {
			this.addListener(this.state.user.uid);
		}
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	removeListeners = () => {
		this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
	};

	addListener = (userId) => {
		let userColors = [];
		this.state.usersRef.child(`${userId}/colors`).on("child_added", (snap) => {
			userColors.unshift(snap.val());
			this.setState({ userColors });
		});
	};

	openModal = () => this.setState({ modal: true });

	closeModal = () => this.setState({ modal: false });

	handleChangePrimary = (color) => this.setState({ primary: color.hex });

	handleChangeSecondary = (color) => this.setState({ secondary: color.hex });

	handleSaveColors = () => {
		if (this.state.primary && this.state.secondary) {
			this.saveColors(this.state.primary, this.state.secondary);
		}
	};

	saveColors = (primary, secondary) => {
		this.state.usersRef
			.child(`${this.state.user.uid}/colors`)
			.push()
			.update({
				primary,
				secondary,
			})
			.then(() => {
				console.log("color added");
				this.closeModal();
			})
			.catch((err) => console.error(err));
	};

	displayUserColors = (colors) =>
		colors.length > 0 &&
		colors.map((color, i) => (
			<React.Fragment key={i}>
				<Divider />
				<div
					className='color__container'
					onClick={() => this.props.setColors(color.primary, color.secondary)}
					style={{ border: "white 1px solid" }}
				>
					<div className='color__square' style={{ background: color.primary }}>
						<div
							className='color__overlay'
							style={{ background: color.secondary }}
						></div>
					</div>
				</div>
			</React.Fragment>
		));

	render() {
		const { modal, primary, secondary, userColors } = this.state;

		return (
			<Sidebar
				as={Menu}
				icon='labeled'
				// inverted
				vertical
				visible
				width='very thin'
				style={{ background: "black", overflowY: "scroll" }}
			>
				<Divider />
				<Button
					icon='add'
					size='small'
					color='blue'
					onClick={this.openModal}
				></Button>
				{this.displayUserColors(userColors)}
				{/* color picker */}
				<Modal basic open={modal} onClose={this.closeModal}>
					<Modal.Header>Choose App Colors</Modal.Header>
					<Modal.Content>
						{/* <Segment inverted>
							<Label content='Primary Color' />
							<SliderPicker
								color={primary}
								onChange={this.handleChangePrimary}
							/>
						</Segment>

						<Segment inverted>
							<Label content='Secondary Color' />
							<SliderPicker
								color={secondary}
								onChange={this.handleChangeSecondary}
							/>
						</Segment> */}
						<Segment inverted>
							<div style={{ width: "50%", display: "inline-block" }}>
								<Label content='Primary Color' />
								<SwatchesPicker
									color={primary}
									onChange={this.handleChangePrimary}
								/>
							</div>
							<div style={{ width: "50%", display: "inline-block" }}>
								<Label content='Secondary Color' />
								<SwatchesPicker
									color={secondary}
									onChange={this.handleChangeSecondary}
								/>
							</div>
						</Segment>
					</Modal.Content>
					<Modal.Actions>
						<Button inverted color='green' onClick={this.handleSaveColors}>
							<Icon name='checkmark' />
							Save Colors
						</Button>
						<Button inverted color='red' onClick={this.closeModal}>
							<Icon name='remove' />
							Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</Sidebar>
		);
	}
}

export default connect(null, { setColors })(ColorPanel);
