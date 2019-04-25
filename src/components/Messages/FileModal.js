import React, { Component } from 'react'
import mime from 'mime-types'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'

export default class FileModal extends Component {
  state = {
    file: null,
    authorized: ['image/jpeg', 'image/png']
  }

  addFile = e => {
    const file = e.target.files[0]
    if (file) {
      this.setState({ file })
    }
  }

  uploadFile = () => {
    const { file } = this.state
    const { uploadFileToDB, closeModal } = this.props

    if (file !== null) {
      console.log(file)
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) }
        uploadFileToDB(file, metadata)
        closeModal()
        this.clearFile()
      }
    }
  }

  isAuthorized = filename =>
    this.state.authorized.includes(mime.lookup(filename))

  clearFile = () => this.setState({ file: null })

  render() {
    const { modal, closeModal } = this.props

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="File type: jpg, png"
            name="file"
            type="file"
          />
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={this.uploadFile} color="green" inverted>
            <Icon name="checkmark" /> Upload
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
