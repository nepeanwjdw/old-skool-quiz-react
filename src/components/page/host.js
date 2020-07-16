import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import fetch from 'node-fetch'
import io from 'socket.io-client'

import ConvertToJson from '../../services/convert-to-json'
import ErrorMessagesFactory from '../factory/error-messages'
import GameContainer from '../container/game'
import HandleErrors from '../../services/handle-errors'
import SelectOptionsFactory from '../factory/select-options'

class Host extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    const { api, game } = this.props

    this.state = {
      _api: `${api}/host`,
      _socket: game ? io(`${api}/${game.gamecode}`) : null,
      errors: {
        api: null,
        form: null
      },
      form: {
        id: ''
      },
      listen: true
    }
  }

  componentDidMount () {
    const { _socket, listen } = this.state

    if (_socket && listen) {
      _socket.on('update game', game => this.props.updateGame(game))
    }
  }

  componentWillUnmount () {
    const { _socket } = this.state

    if (_socket) {
      _socket.off('update game')
    }
  }

  handleChange (event) {
    const { errors, form } = this.state
    const { name: n, value: v } = event.target

    if (errors.form && v) {
      errors.form = null
    }

    form[n] = v

    this.setState({
      errors,
      form
    })
  }

  async handleSubmit (event) {
    event.preventDefault()

    const { _api, errors, form: { id } } = this.state

    errors.api = null

    if (!id) {
      errors.form = 'A selection is required'
    }

    const post = !Object.values(errors).filter(error => error !== null).length

    if (post) {
      try {
        const { cookie, game: { gamecode }, updateGame } = this.props

        this.setState({
          listen: false
        })

        await fetch(_api, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cookie,
            gamecode,
            id
          })
        })
          .then(HandleErrors)
          .then(ConvertToJson)
          .then(res => {
            updateGame(res.game)
          })
      } catch (e) {
        errors.api = 'Unable to select host'

        this.setState({
          errors,
          listen: true
        })
      }
    } else {
      this.setState({
        errors
      })
    }
  }

  render () {
    const { game } = this.props
    const { errors } = this.state

    const _redirect = game ? game.host.id ? '/game/play' : null : '/'

    if (_redirect) {
      return <Redirect to={_redirect} />
    }

    return (
      <GameContainer game={game}>
        <form onSubmit={this.handleSubmit}>
          <label className='sub-heading' htmlFor='id'>Select the host...</label>
          <select defaultValue='' name='id' onChange={this.handleChange}>
            <option value='' disabled>Select</option>
            {SelectOptionsFactory(game.players)}
          </select>

          <button className='rubber'>Submit</button>
        </form>

        {ErrorMessagesFactory(errors)}

        <p>The host can change this between questions.</p>
      </GameContainer>
    )
  }
}

export default Host
