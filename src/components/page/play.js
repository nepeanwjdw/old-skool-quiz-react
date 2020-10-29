import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

import io from "socket.io-client";

import AnswerForm from "../class/answer-form";
import AskNextQuestionLink from "../function/ask-next-question-link";
import EndCountdownButton from "../class/end-countdown-button";
import GameContainer from "../container/game";
import GuideLink from "../function/guide-link";
import ImgEnlargedContainer from "../function/img-enlarged-container";
import MenuTables from "../class/menu-tables";
import PointsTable from "../function/points-table";
import QuestionTables from "../function/question-tables";

const Game = ({ api, game, cookie, updateGame, handleClick }) => {
  const _socket = game ? io(`${api}/${game.gamecode}`) : null;
  const imgEnlarged = null;

  useEffect(() => {
    if (_socket) {
      _socket.on("remove player", (id) => {
        if (cookie === +id) {
          updateGame();
        }
      });
      _socket.on("update game", (game) => updateGame(game));
    }
    return () => {
      if (_socket) {
        _socket.off("remove player");
        _socket.off("update game");
      }
    };
  });

  const handleChange = (event) => {};

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const _redirect = game ? (game.host.id ? null : "/game/host") : "/";

  return (
    <>
      {_redirect ? (
        <Redirect to={_redirect} />
      ) : (
        <>
          <GameContainer game={game}>
            <div className="sub-heading">
              Asking the questions is... <span id="host">{game.host.name}</span>
            </div>
            {!game.counting && cookie === game.host.id && (
              <AskNextQuestionLink />
            )}
            {!game.counting && <PointsTable players={game.players} />}
            {!game.counting && cookie === game.host.id && (
              <MenuTables api={api} game={game} />
            )}
            {game.counting && cookie === game.host.id && (
              <EndCountdownButton api={api} game={game} />
            )}
            {game.counting && cookie !== game.host.id && (
              <AnswerForm api={api} game={game} cookie={cookie} />
            )}
            <QuestionTables api={api} game={game} handleClick={handleClick} />
            <GuideLink />
          </GameContainer>
          {imgEnlarged && <ImgEnlargedContainer />}
        </>
      )}
    </>
  );
};

export default Game;
