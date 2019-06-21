import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react'
import db from '../../db/db'

export class DirectMessages extends Component {
  state = {
    user: this.props.currentUser,
    users: [],
    usersRef: db.collection('users'),
    connectedRef: db.collection('connected'),
    onlineRef: db.collection('onlineStatus')
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid)
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = []
    this.state.usersRef.onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if (change.type === 'added') {
          if (currentUserUid !== change.doc.id) {
            let user = change.doc.data()
            user['uid'] = change.doc.id
            user['status'] = 'offline'
            loadedUsers.push(user)
            this.setState({ users: loadedUsers })
          }
        }
      })
    })

    this.state.connectedRef.onSnapshot(
      snapShot => {
        if (!snapShot.empty) {
          const ref = this.state.onlineRef.doc(currentUserUid)
          ref.set()
        }
      },
      err => {
        if (err !== null) {
          console.log(err)
        }
      }
    )

    this.state.onlineRef.onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if ((change.type = 'added')) {
          if (currentUserUid !== change.doc.id) {
            this.addStatusToUser(change.doc.id)
          }
        }

        if ((change.type = 'removed')) {
          if (currentUserUid !== change.doc.id) {
            this.addStatusToUser(change.doc.id, false)
          }
        }
      })
    })
  }

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`
      }
      return acc.concat(user)
    }, [])
    this.setState({ users: updatedUsers })
  }

  isUserOnline = user => user.status === 'online'

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid)
    const channelData = {
      id: channelId,
      name: user.name
    }
    this.props.setCurrentChannel(channelData)
    this.props.setPrivateChannel(true)
  }

  getChannelId = userId => {
    return userId < this.state.user.uid
      ? `${userId}-${this.state.user.uid}`
      : `${this.state.user.uid}-${userId}`
  }

  render() {
    const { users } = this.state

    return (
      <div>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>Direct Messages</span> ({users.length})
          </Menu.Item>
          {users.map(user => (
            <Menu.Item
              key={user.uid}
              onClick={() => this.changeChannel(user)}
              style={{ opacity: 0.7, fontStyle: 'italic' }}
            >
              <Icon
                name="circle"
                color={this.isUserOnline(user) ? 'green' : 'red'}
              />
              @ {user.name}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </div>
    )
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(DirectMessages)
