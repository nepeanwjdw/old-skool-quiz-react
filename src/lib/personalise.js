const Personalise = (_game, cookie) => {
  const game = { ..._game }
  const { players } = game

  for (const [key, value] of Object.entries(players)) {
    if (!value.visible) {
      delete players[key]
    }
  }

  game.questions.forEach((q, i) => {
    if (!q.showAnswer) {
      delete q.answer
    }

    for (const [key, value] of Object.entries(players)) {
      if (value.answers[i] && !value.answers[i].visible) {
        if (cookie !== +key && cookie !== game.host.id) {
          delete value.answers[i].answer
        }
      }
    }
  })

  return game
}

export default Personalise
