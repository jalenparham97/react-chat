import React, { Component } from 'react'
import uuid from 'uuid'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../actions'
import db from '../../db/db'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'

class Channels extends Component {
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    chanelDetails: '',
    channelsRef: db.collection('channels'),
    firstLoad: true,
    modal: false
  }

  componentDidMount() {
    this.addListners()
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  addListners = () => {
    let loadedChannels = []
    this.state.channelsRef.onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if (change.type === 'added') {
          loadedChannels.push(change.doc.data())
          this.setState({ channels: loadedChannels }, () =>
            this.setDefaultChannel()
          )
        }
      })
    })
  }

  removeListeners = () => {
    this.addListners()
  }

  setDefaultChannel = () => {
    const defaultChannel = this.state.channels[0]
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(defaultChannel)
    }
    this.setState({ firstLoad: false })
  }

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state
    const id = uuid()

    const newChannel = {
      id,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    }

    channelsRef
      .doc(id)
      .set(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' })
        this.closeModal()
        console.log('channel added')
      })
      .catch(err => console.error(err))
  }

  closeModal = () => this.setState({ modal: false })

  openModal = () => this.setState({ modal: true })

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))

  changeChannel = channel => {
    this.setActiveChannel(channel)
    this.props.setCurrentChannel(channel)
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
  }

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails

  render() {
    const { channels, modal } = this.state

    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>Channels</span> ({channels.length}){' '}
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {/* Channels */}
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Add Channels Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add A Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>

            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(
  null,
  { setCurrentChannel }
)(Channels)
