import React, { Component } from 'react'

import io from 'socket.io-client'

class AnswerForm extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    const { api, game } = this.props

    this.state = {
      _socket: game ? io(`${api}/${game.gamecode}`) : null,
      form: {
        answer: ''
      }
    }
  }

  handleChange (event) {
    const { form } = this.state
    const { name: n, value: v } = event.target

    form[n] = v

    this.setState({
      form
    })
  }

  handleSubmit (event) {
    event.preventDefault()

    const { cookie, updateCookie } = this.props
    const { _socket, form } = this.state

    updateCookie()
    _socket.emit('add answer', form.answer, cookie)
  }

  render () {
    return (
      <form id='answer' onSubmit={this.handleSubmit}>
        <input
          autoComplete='off'
          name='answer'
          onChange={this.handleChange}
          placeholder='Enter your answer...'
          type='text'
          value={this.state.answer}
        />

        <button className='rubber'>Submit</button>
      </form>
    )
  }
}

export default AnswerForm
