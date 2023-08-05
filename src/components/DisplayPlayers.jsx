import React, { forwardRef, useEffect, useRef, useState } from 'react'
import TournamentWinnersHallOfFame from './TournamentWinnersHallOfFame'
import VisualDisplay from './VisualDisplay';
import GoldenBallsHallOfFame from './GoldenBallsHallOfFame';

const DisplayPlayers = forwardRef(function(props, ref) {

  let visualTableRef = useRef();

  let [error, setError] = useState(false);
  let [players, setPlayers] = useState([]);
  let [tournamentsHallOfFamers, settournamentsHallOfFamers] = useState([]);
  let [goldenBootsHallOfFamers, setgoldenBootsHallOfFamers] = useState([]);
  let [allTimeGames, setallTimeGames] = useState(1);
  let [hallofFameTab, sethallofFameTab] = useState(0);


  useEffect(() => {
    async function fetchPlayers() {
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

        if(data && data.players) {
          const mostParticipated = data.players.reduce((maxPlayed, currentObj) => {
            if (Number(currentObj.played) > Number(maxPlayed.played)) {
              return currentObj;
            } else {
              return maxPlayed;
            }
          }, data.players[0]);
          setallTimeGames(prevState => Number(mostParticipated.played));
  
          let validatedPlayersArray = [];
          let MIAPlayersArray = [];
  
          data.players.map(function(player) {
            validateParticipation(Number(mostParticipated.played), player.played) ? validatedPlayersArray.push(player) : MIAPlayersArray.push(player);
          })
  
          setPlayers(function(prevState) {
            return [...prevState, ...validatedPlayersArray, ...MIAPlayersArray]
          })

          settournamentsHallOfFamers(function(prevState) {
            return[...prevState, ...validatedPlayersArray.slice(0,3)]
          })

          setgoldenBootsHallOfFamers(function(prevState) {
            let sortedGoldenBootsArr = validatedPlayersArray.sort((a, b) => Number(b.goldenboot) - Number(a.goldenboot));
            // sortedGoldenBootsArr.filter(el => Number(el.goldenboot) > 0)
            console.log(sortedGoldenBootsArr)
            return[...prevState, ...sortedGoldenBootsArr.filter(el => Number(el.goldenboot) > 0).slice(0,3)]
          })
  
        } else {
          setError(true);
        }
      } catch(e) {
        console.log(e)
      }
    }

    fetchPlayers(); // Fetch players from the API
  }, [])

  function validateParticipation(t, p) {
    let total = Number(t),
        participated = Number(p);

    let percentage = Math.round((participated / total) * 100);
    return percentage > 50; // check if palyer participated in atleast a half of the total played tournaments
  }

  function changeHallofFameTab(e) {
    e.target.checked ? sethallofFameTab(1) : sethallofFameTab(0);
  }
  
  return (
    <>
    <div className="hall-of-fame">
      <form action="" id="hall-of-famers-toggle">
        <p>Tournaments</p>
        <input type="checkbox" onChange={e => changeHallofFameTab(e)} name="hall-of-famers-toggle-button" id="hall-of-famers-toggle-button" />
        <label htmlFor="hall-of-famers-toggle-button" title="Click me"></label>
        <p>Golden Boots</p>
      </form>

    {hallofFameTab === 0 ? 
      <TournamentWinnersHallOfFame tournamentsHallOfFamers={tournamentsHallOfFamers} error={error} />
      :
      <GoldenBallsHallOfFame goldenbootsHallOfFamers={goldenBootsHallOfFamers} error={error} />
    }
    </div>

    <div className="players-table" ref={ref}>
      <div className="container">
            <h2>Player ranks based on:</h2>
            <ol type="1">
              <li>Most tournaments won</li>
              <li>Goal Difference</li>
            </ol>

            <br />
            <strong>* Players with less than 50% participation are labeled as Missing In Action (MIA)</strong>
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
                  <div className={index === 0 ? `player player-first ${validateParticipation(allTimeGames, player.played) ? '' : 'mia'}` : `player ${validateParticipation(allTimeGames, player.played) ? '' : 'mia'}`} key={index}>
                    <p className={validateParticipation(allTimeGames, player.played) ? `player-position` : `player-position player-position-in-question`}>{validateParticipation(allTimeGames, player.played) ? `#${index + 1}` : "MIA"}</p>
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