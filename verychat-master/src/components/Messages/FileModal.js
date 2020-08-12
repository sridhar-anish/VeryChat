import React, { Component } from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

export default class FileModal extends Component {
	state = {
		file: null,
		authorized: ["image/jpg", "image/jpeg", "image/png", "image/gif"],
	};

	addFile = (event) => {
		const file = event.target.files[0];
		if (file) {
			this.setState({ file });
		}
	};

	sendFile = () => {
		const { file } = this.state;
		const { uploadFile, closeModal } = this.props;

		if (file !== null) {
			if (this.isAuthorized(file.name)) {
				const metadata = {
					contentType: mime.lookup(file.name),
				};
				uploadFile(file, metadata);
				closeModal();
				this.clearFile();
			}
		}
	};

	clearFile = () => this.setState({ file: null });

	isAuthorized = (filename) =>
		this.state.authorized.includes(mime.lookup(filename));

	render() {
		const { modal, closeModal } = this.props;
		return (
			<Modal basic open={modal} onClose={closeModal}>
				<Modal.Header>Select a file</Modal.Header>
				<Modal.Content>
					<Input
						fluid
						label='File types: jpg, png, gif; Up to 1MB only'
						name='file'
						type='file'
						onChange={this.addFile}
					/>
				</Modal.Content>

				<Modal.Actions>
					<Button color='green' inverted onClick={this.sendFile}>
						<Icon name='checkmark' />
						Send
					</Button>
					<Button color='red' inverted onClick={closeModal}>
						<Icon name='remove' />
						Cancel
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}
