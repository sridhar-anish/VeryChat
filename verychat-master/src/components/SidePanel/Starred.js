import React, { Component } from "react";
import firebase from "../../firebase";
import Channels from "./Channels";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { Menu, Icon } from "semantic-ui-react";

class Starred extends Component {
	state = {
		activeChannel: "",
		user: this.props.currentUser,
		usersRef: firebase.database().ref("users"),
		starredChannels: [],
	};

	componentDidMount() {
		if (this.state.user) {
			this.addListeners(this.state.user.uid);
		}
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	removeListeners = () => {
		this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
	};

	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	};

	changeChannel = (channel) => {
		this.setActiveChannel(channel);
		this.props.setCurrentChannel(channel);
		this.props.setPrivateChannel(false);
	};

	addListeners = (userId) => {
		this.state.usersRef
			.child(userId)
			.child("starred")
			.on("child_added", (snap) => {
				const starredChannel = {
					id: snap.key,
					...snap.val(),
				};
				this.setState({
					starredChannels: [...this.state.starredChannels, starredChannel],
				});
			});

		this.state.usersRef
			.child(userId)
			.child("starred")
			.on("child_removed", (snap) => {
				const channelToRemove = {
					id: snap.key,
					...snap.val(),
				};
				const filteredChannels = this.state.starredChannels.filter(
					(channel) => {
						return channel.id !== channelToRemove.id;
					}
				);
				this.setState({ starredChannels: filteredChannels });
			});
	};

	displayChannels = (starredChannels) =>
		starredChannels &&
		starredChannels.length > 0 &&
		starredChannels.map((channel) => (
			<Menu.Item
				key={channel.id}
				onClick={() => this.changeChannel(channel)}
				name={channel.name}
				style={{
					opacity: 0.7,
				}}
				active={channel.id === this.state.activeChannel}
			>
				# {channel.name}
				{channel.id === this.state.activeChannel ? (
					<Icon name='eye' size='large' />
				) : (
					""
				)}
			</Menu.Item>
		));

	render() {
		const { starredChannels } = this.state;
		return (
			<Menu.Menu>
				<Menu.Item>
					<span>
						<Icon name='star' /> Starred
					</span>{" "}
					({starredChannels.length})
				</Menu.Item>
				{this.displayChannels(starredChannels)}
			</Menu.Menu>
		);
	}
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
