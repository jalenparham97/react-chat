import React, { Component } from 'react'
import firebase from '../../db/firebase'
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

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
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

  isFormValid = ({ email, password }) => email && password

  render() {
    const { email, password, erros, loading } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to ReactChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
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

              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
