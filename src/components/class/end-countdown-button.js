import React, { Component } from 'react'

import io from 'socket.io-client'

class EndCountdownButton extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)

    const { api, game } = this.props

    this.state = {
      _socket: game ? io(`${api}/${game.gamecode}`) : null
    }
  }

  handleClick () {
    this.state._socket.emit('end countdown')
  }

  render () {
    return (
      <div id='end-countdown'>
        <button className='rubber' onClick={this.handleClick}>End countdown</button>
      </div>
    )
  }
}

export default EndCountdownButton
