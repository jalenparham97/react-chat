import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import * as serviceWorker from './serviceWorker'
import firebase from './db/firebase'

import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom'

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) this.props.history.push('/')
    })
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}

const RootWithAuth = withRouter(Root)

ReactDOM.render(
  <Router>
    <RootWithAuth />
  </Router>,
  document.getElementById('root')
)
serviceWorker.unregister()
