import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import io from 'socket.io-client'

import AnswerForm from '../class/answer-form'
import AskNextQuestionLink from '../function/ask-next-question-link'
import EndCountdownButton from '../class/end-countdown-button'
import GameContainer from '../container/game'
import GuideLink from '../function/guide-link'
import ImgEnlargedContainer from '../function/img-enlarged-container'
import MenuTables from '../class/menu-tables'
import PointsTable from '../function/points-table'
import QuestionTables from '../function/question-tables'

class Game extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    const { api, game } = this.props

    this.state = {
      _socket: game ? io(`${api}/${game.gamecode}`) : null,
      imgEnlarged: null
    }
  }

  componentDidMount () {
    const { _socket } = this.state

    if (_socket) {
      _socket.on('remove player', id => {
        const { cookie, updateGame } = this.props

        if (cookie === +id) {
          updateGame()
        }
      })
      _socket.on('update game', game => this.props.updateGame(game))
    }
  }

  componentWillUnmount () {
    const { _socket } = this.state

    if (_socket) {
      _socket.off('remove player')
      _socket.off('update game')
    }
  }

  handleChange (event) {

  }

  async handleSubmit (event) {
    event.preventDefault()
  }

  render () {
    const { cookie, game } = this.props
    const { imgEnlarged } = this.state

    const _redirect = game ? game.host.id ? null : '/game/host' : '/'

    if (_redirect) {
      return <Redirect to={_redirect} />
    }

    return (
      <>
        <GameContainer game={game}>
          <div className='sub-heading'>Asking the questions is... <span id='host'>{game.host.name}</span></div>

          {(!game.counting && cookie === game.host.id ? <AskNextQuestionLink /> : null)}
          {(!game.counting ? <PointsTable players={game.players} /> : null)}
          {(!game.counting && cookie === game.host.id ? <MenuTables {...this.props} /> : null)}

          {(game.counting && cookie === game.host.id ? <EndCountdownButton {...this.props} /> : null)}
          {(game.counting && cookie !== game.host.id ? <AnswerForm {...this.props} /> : null)}

          <QuestionTables {...this.props} />

          <GuideLink />
        </GameContainer>

        {(imgEnlarged ? <ImgEnlargedContainer /> : null)}
      </>
    )
  }
}

export default Game
