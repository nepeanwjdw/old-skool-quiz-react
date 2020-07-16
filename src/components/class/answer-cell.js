import React, { Component } from 'react'

import io from 'socket.io-client'

class AnswerCell extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)

    const { api, game } = this.props

    this.state = {
      _socket: game ? io(`${api}/${game.gamecode}`) : null
    }
  }

  handleClick (event, bool, i, id) {
    this.state._socket.emit('add/remove points', !bool, i, id)
  }

  render () {
    const { answer, cookie, game: { host }, i, id } = this.props

    if (answer) {
      const { answer: _answer, correct, visible } = answer

      if (visible) {
        if (cookie === host.id) {
          if (correct) {
            return (
              <td className='answer' data-id={id}>
                <span className='highlight-green' onClick={event => this.handleClick(event, correct, i, id)}>{_answer}</span>
              </td>
            )
          } else {
            return (
              <td className='answer' data-id={id}>
                <span onClick={event => this.handleClick(event, correct, i, id)}>{_answer}</span>
              </td>
            )
          }
        } else {
          if (correct) {
            return (
              <td data-id={id}>
                <span className='highlight-green'>{_answer}</span>
              </td>
            )
          } else {
            return (
              <td data-id={id}>
                <span>{_answer}</span>
              </td>
            )
          }
        }
      } else {
        if (_answer) {
          return (
            <td className='highlight-blue' data-id={id}>
              <span>{_answer}</span>
            </td>
          )
        } else {
          return (
            <td className='highlight-blue' data-id={id} />
          )
        }
      }
    } else {
      return (
        <td data-id={id} />
      )
    }
  }
}

export default AnswerCell
