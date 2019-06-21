import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import db from '../../db/db'

import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'

export default class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: []
  }

  componentDidMount() {
    const { channel, user } = this.state

    if (channel && user) {
      this.addLisners(channel.id)
    }
  }

  addLisners = channelId => {
    this.addMessageListener(channelId)
  }

  addMessageListener = channelId => {
    let loadedMessages = []
    let ref = this.getMessagesRef(channelId)
    console.log(ref)
    ref.onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if (change.type === 'added') {
          loadedMessages.push(change.doc.data())
          this.setState({
            messages: loadedMessages,
            messagesLoading: false
          })
          this.countUniqueUsers(loadedMessages)
        }
      })
    })
  }

  getMessagesRef = channelId => {
    const { privateChannel } = this.state
    console.log(privateChannel)
    let ref
    if (privateChannel) {
      ref = db.collection(`privateMessages/${channelId}/messages`)
    } else {
      ref = db.collection(`channels/${channelId}/messages`)
    }
    console.log(ref)
    return ref
  }

  handleSearchChange = e => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    )
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]
    const regex = new RegExp(this.state.searchTerm, 'gi')
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        // prettier-ignore
        (message.content && message.content.match(regex)) || message.user.name.match(regex)
      ) {
        acc.push(message)
      }
      return acc
    }, [])
    this.setState({ searchResults })
    setTimeout(() => this.setState({ searchLoading: false }), 1000)
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc
    }, [])
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`
    this.setState({ numUniqueUsers })
  }

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.createdAt}
        message={message}
        user={this.state.user}
      />
    ))

  displayChannelName = channel => {
    return channel
      ? `${this.state.privateChannel ? '@' : '#'}${channel.name}`
      : ''
  }

  render() {
    // prettier-ignore
    const { channel, user, messages, numUniqueUsers, searchResults, searchTerm, searchLoading, privateChannel } = this.state

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={channel}
          messagesRef={db.collection(
            `channels/${channel && channel.id}/messages`
          )}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={
            channel && channel.id
              ? this.getMessagesRef(channel.id)
              : 'No channel Id'
          }
        />
      </React.Fragment>
    )
  }
}
