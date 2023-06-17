import React, { forwardRef, useEffect, useState } from 'react'
import HallOfFame from './HallOfFame'

const DisplayPlayers = forwardRef(function(props, ref) {
  let [players, setPlayers] = useState([]);
  let [hallOfFamers, sethallOfFamers] = useState([]);


  useEffect(() => {
    async function fetchPlayers() {
      let apiUrl = window.location.host.indexOf("localhost") > -1 ? "https://localhost/mabingwa/api.php?action=fetchplayers" : "https://leaderboard.image-editor-online.com/api.php?action=fetchplayers";
      let response = await fetch(apiUrl, {method: "get"});
      let data = await response.json();
  
      setPlayers(function(prevState) {
        return [...prevState, ...data.players]
      })
      sethallOfFamers(function(prevState) {
        return[...prevState, ...data.players.slice(0,3)]
      })
    }

    fetchPlayers(); // Fetch players from the DB
    // console.log("called");
  }, [])
  
  return (
    <>
    <HallOfFame hallOfFamers={hallOfFamers} />
    <div className="players-table" ref={ref}>
      <div className="container">
            <h2>Player ranks based on all time:</h2>
            <ul>
              <li>Most tournaments won</li>
              <li>Goal Difference</li>
            </ul>
            <hr />
            <div className="players-titles">
              <p><span className="display-lg">Rank</span><span className="display-sm">#</span></p>
              <p><span className="display-lg">Name</span><span className="display-sm">?</span></p>
              <p>P</p>
              <p>W</p>
              <p>GF</p>
              <p>GA</p>
              <p>GD</p>
            </div>
            {players.map(function(player, index) {
              return (
                <div className={index === 0 ? "player player-first" : "player"} key={index}>
                  <p className="player-position">#{index + 1}</p>
                  <p className="player-name">{player.name}</p>
                  <p className="wins">{player.played}</p>
                  <p className="wins">{player.won}</p>
                  <p className="gf">{player.gf}</p>
                  <p className="ga">{player.ga}</p>
                  <p className="gd">{player.gf - player.ga}</p>
                </div>
              )
            })}
          </div>
    </div>
    </>
  )
})

export default DisplayPlayers