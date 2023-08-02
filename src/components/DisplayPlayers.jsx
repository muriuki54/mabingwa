import React, { forwardRef, useEffect, useRef, useState } from 'react'
import HallOfFame from './HallOfFame'
import VisualDisplay from './VisualDisplay';

const DisplayPlayers = forwardRef(function(props, ref) {

  let visualTableRef = useRef();

  let [error, setError] = useState(false);
  let [players, setPlayers] = useState([]);
  let [hallOfFamers, sethallOfFamers] = useState([]);


  useEffect(() => {
    async function fetchPlayers() {
      // let apiUrl = "https://leaderboard.image-editor-online.com/api.php?action=fetchplayers";
      // let apiUrl = "https://localhost/mabingwa/api.php?action=fetchplayers";
      let apiUrl = window.location.host.indexOf("localhost") > -1 ? "https://localhost/mabingwa/api.php?action=fetchplayers" : "https://leaderboard.image-editor-online.com/api.php?action=fetchplayers";
      let response, data;
      try {
        response = await fetch(apiUrl, {method: "get"});
        if(! response.ok) {
          setError(true);
          // throw new Error(response.statusText);
        }
        console.log(response)
        data = await response.json();
        // data = await response.text();
      } catch(e) {
        console.log(e)
      }
  
      if(data && data.players) {
        setPlayers(function(prevState) {
          return [...prevState, ...data.players]
        })
        sethallOfFamers(function(prevState) {
          return[...prevState, ...data.players.slice(0,3)]
        })
      } else {
        setError(true);
      }
    }

    fetchPlayers(); // Fetch players from the DB
    // console.log("called");
  }, [])
  
  return (
    <>
    <HallOfFame hallOfFamers={hallOfFamers} error={error} />

    <div className="players-table" ref={ref}>
      <div className="container">
            <h2>Player ranks based on:</h2>
            <ol type="1">
              <li>Most tournaments won</li>
              <li>Goal Difference</li>
            </ol>
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
            {! error ?
            <>
            {
              players.map(function(player, index) {
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
              })
            }
            </>
            :
            <p className="loading">An error occured. Could not fetch player stats</p>
            }
          </div>

          <VisualDisplay players={players} ref={visualTableRef} />
    </div>

    </>
  )
})

export default DisplayPlayers