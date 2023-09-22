import React, { useState, useEffect, useRef } from 'react'
import { useNavigate  } from 'react-router-dom';

function AddTournament() {
  const winnerSection = useRef();

  const navigate = useNavigate();

  let [tournament, setTournament] = useState({
    tournamentType: null,
    winner: null,
    password: "",
    players: [],
  })
  let [error, setError] = useState(false);

  useEffect(() => {
    fetchPlayers(); // Fetch players from the DB
  }, [])

  async function fetchPlayers() {
    let apiUrl = window.location.host.indexOf("localhost") > -1 ? "https://localhost/mabingwa/api.php?action=fetchcurrentseason" : "https://leaderboard.image-editor-online.com/api.php?action=fetchcurrentseason";
    let response, data;
    try {
      response = await fetch(apiUrl, {method: "get"});
      if(! response.ok) {
        // throw new Error("Could not fetch players");
        setError(true);
      }
      data = await response.json();
    } catch(e) {
      console.log(e);
      setError(true);
    }

    if(data && data.players) {
      let playerObjsArray = [];
      data.players.forEach(function(player) {
        playerObjsArray.push({
          id: player.id,
          name: player.name,
          ga: 0,
          gf: 0,
          played: false,
          won: false,
          goldenBoot: false
        })
      })
      setTournament(prevState => {
        return {
          ...prevState,
          players: playerObjsArray
        }
      })
    }
  };

  function updateTournamentStatus(e, stat, playerId = null) {
    let players = tournament.players;
    let playerIndex = tournament.players.findIndex(player => player.id === playerId)

    switch(stat) {
      case "tournamentType":
        tournament.tournamentType = e.target.value;
        break;
      case "played":
        tournament.players[playerIndex].played = e.target.checked;
        break;
      case "ga":
        tournament.players[playerIndex].ga = e.target.value;
        break;
      case "gf":
        tournament.players[playerIndex].gf = e.target.value;
        break;
      case "won":
        tournament.players.forEach(player => {
          player.won = false;
        })
        tournament.players[playerIndex].won = e.target.checked;
        tournament.winner = Number(playerId);
        break;
      case "password":
        tournament.password = e.target.value;
        break;
      case "goldenbootwinner":
        tournament.players.forEach(player => {
          player.goldenBoot = false;
        })
        tournament.players[playerIndex].goldenBoot = e.target.checked;
        break;
      default:
        break;
    }

    // Set the stat to our new copy
    setTournament(prevState => {
      return {
        ...prevState,
        players
      }
    })
  }


  // Submit torunament stats
  async function createTournament(e) {
    e.preventDefault();

    // Ensure tournament type is selected: fifa/pes
    if(!tournament.tournamentType) {
      alert("Please select the torunament type");
      return;
    }
    // Ensure we have a tournament winner
    if(! tournament.winner) {
      alert("Please select the tournament winner");
      winnerSection.current?.scrollIntoView({behavior: "smooth"});
      return;
    }

    // Ensure the winner actually played
    let tournamentWinner = tournament.players.filter(player => Number(player.id) === tournament.winner);
    if(! tournamentWinner[0].played) {
      alert("Winner must have played in the tournament");
      return;
    }
   
  // Ensure the we have a golden boot winner
    let goldenbootWinner = tournament.players.filter(player => player.goldenBoot === true);
    if(goldenbootWinner.length === 0) {
      alert("Please select a golden boot winner");
      return;
    }

    let apiUrl = window.location.host.indexOf("localhost") > -1 ? "https://localhost/mabingwa/api.php" : "https://leaderboard.image-editor-online.com/api.php";

    let formData = new FormData();
    formData.append("newtournament", JSON.stringify(tournament));

    let request = await fetch(apiUrl, {
      method: "post",
      body: formData, 
    })

    // let response = await request.json();
    let response = await request.json();

    // console.log(response);
    if(response.success) {
      alert(response.message);
      // Redirect to homepage
      navigate("/");
    } else {
      alert(response.message);
    }

  }

  function stringToLower(str) { // Replace whitespace with underscores
  return str.toLowerCase().replace(/ /g, "_");
  }

  return (
    <div className='new-tournament'>
      <div className="container">
        <form action="" method="post" onSubmit={e => createTournament(e)}>
          <div className="won-by" ref={winnerSection}>
            <h1>Tournament Type</h1>
            <hr />
            <div className="field">
                <input type="radio" name="tournament" value="fifa" onChange={e => updateTournamentStatus(e, "tournamentType", null)} id="fifa-tournament" />
                <label htmlFor="fifa-tournament">FIFA</label>
              </div>
            <div className="field">
                <input type="radio" name="tournament" value="pes" onChange={e => updateTournamentStatus(e, "tournamentType", null)} id="pes-tournament" />
                <label htmlFor="pes-tournament">PES</label>
              </div>

            <h2>Winner</h2>
            <hr />
            {! error ? 
            <>
            {tournament.players.map(function(player, index) {
              return (
                <div className="field" key={index}>
                <input type="radio" name="winner" value={player.id} onChange={e => updateTournamentStatus(e, "won", player.id)} id={stringToLower(player.name) + "_wonstatus"} />
                <label htmlFor={stringToLower(player.name) + "_wonstatus"}>{player.name}</label>
                </div>
              )
            })}
            </>
            : 
            <p className="error">An error occured. Could not fetch players.</p>
            }
            
          </div>
          <div className="golden-boot">
            <h2>Golden boot</h2>
            <hr />
            {! error ? 
            <>
            {tournament.players.map(function(player, index) {
              return (
                <div className="field" key={index}>
                <input type="radio" name="goldenbootwinner" value={player.id} onChange={e => updateTournamentStatus(e, "goldenbootwinner", player.id)} id={stringToLower(player.name) + "_goldenboot"}/>
                <label htmlFor={stringToLower(player.name) + "_goldenboot"}>{player.name}</label>
                </div>
              )
            })}
            </>
            : 
            <p className="error">An error occured. Could not fetch players.</p>
            }
          </div>
          {! error ?
          <>
          <h2>Tournament Winner</h2>
          <hr />
          {tournament.players.map(function(player, index) {
              return (
              <fieldset className={tournament.players[index].played ? "player-stats" : "player-stats fields-disabled"} key={index}>
                <legend>{player.name}</legend>
                <div className="field">
                  <label>Played</label>
                  <input type="checkbox" name={player.name} onChange={e => updateTournamentStatus(e, "played", player.id)} />
                </div>
                <div className="field">
                  <label>Goals For</label>
                  <input type="number" min="0" name="gf" onChange={e => updateTournamentStatus(e, "gf", player.id)}/>
                </div>
                <div className="field">
                  <label>Goals Against</label>
                  <input type="number" min="0" name="ga" onChange={e => updateTournamentStatus(e, "ga", player.id)} />
                </div>
              </fieldset>
              )
          })}

          <div className="field">
            <label>Admin password</label>
            <input type="password" min="0" name="password" onChange={e => updateTournamentStatus(e, "password")} />
          </div>

          <button className="btn btn-primary">SUBMIT</button>
          </>
          :
          <></> // Ann error occured
          }
        </form>
      </div>
    </div>
  )
}

export default AddTournament