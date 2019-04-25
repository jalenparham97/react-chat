import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import './App.css'

import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'

const App = ({ currentUser, currentChannel }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Grid.Column>

      <Grid.Column widrh={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel
})

export default connect(mapStateToProps)(App)
