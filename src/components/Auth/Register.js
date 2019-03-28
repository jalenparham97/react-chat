import React, { Component } from 'react'
import firebase from '../../db/firebase'
import md5 from 'md5'
import db from '../../db/db'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: [],
    loading: false,
    usersRef: db.collection('users')
  }

  isFormEmpty = ({ username, email, password, confirmPassword }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !confirmPassword.length
    )
  }

  isPasswordValid = ({ password, confirmPassword }) => {
    if (password.length < 6 || confirmPassword.length < 6) {
      return false
    } else if (password !== confirmPassword) {
      return false
    } else {
      return true
    }
  }

  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Please fill in all fields!' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid!' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else {
      // Form Valid
      return true
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          // this.setState({ loading: false })
          user.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravitar.com/avatar/${md5(
                user.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(user).then(() => console.log('User Saved'))
            })
            .catch(err => {
              console.log(err)
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              })
            })
          console.log(user)
        })
        .catch(err => {
          console.log(err)
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          })
        })
    }
  }

  saveUser = user => {
    return this.state.usersRef.doc(user.user.uid).set({
      name: user.user.displayName,
      avatar: user.user.photoURL,
      userId: user.user.uid
    })
  }

  render() {
    const { username, email, password, confirmPassword, loading } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for ReactChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                type="text"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
              />
              <Form.Input
                fluid
                type="email"
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
              />
              <Form.Input
                fluid
                type="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
              />
              <Form.Input
                fluid
                type="password"
                name="confirmPassword"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                value={confirmPassword}
              />

              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
