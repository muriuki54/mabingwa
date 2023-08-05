import React from 'react';
import loading from "../assets/loading.svg";
import profile from "../assets/profile.jpg";
import king from "../assets/king.jpg";
import knight from "../assets/knight.jpg";
import archer from "../assets/archer.jpg";
import crown from "../assets/crown.png";

function TournamentWinnersHallOfFame({tournamentsHallOfFamers, error}) {
    function getProfile(index) {
        switch(index) {
            case 0:
                return king;
            case 1:
                return knight;
            case 2:
                return archer;
            default:
                return profile;
        }
    }
  return (
    <div className="container hall-fame-tab">
        {! error ? 
        <>
        <h1 className="text-center">FIFA <span className="text-shadow">Tournaments</span> Hall of fame</h1>
        <hr />

        {tournamentsHallOfFamers.length > 0 ? 
        <div className="members">
        {tournamentsHallOfFamers.map(function(player, index) {
            return(
                <div className={index === 0 ? "member member-big rank-"+(index+1) : "member member-small rank-"+(index+1)} key={index}>{/* Member */}
                    <img src={getProfile(index)} alt="" className="profile-pic" />
                    <h2 className="hall-of-famer">{player.name}</h2>
                    <small>Wins</small>
                    <p className="wins">{player.won}</p>
                    {index === 0 ? 
                    <div className="crown">
                        <img src={crown} alt="" />
                    </div> 
                    :
                    ""
                    }
                    <div className="hall-of-famer-rank">
                        <p className="hall-of-famer-position">{index + 1}</p>
                        <div className="hall-of-famer-rank-bg"></div>
                    </div>
                </div>
            )
            })
        }
        </div>
        : 
        <div className="loading">
            <img src={loading} alt=""/>
            <p>Loading ....</p>
        </div>
        }
        </>
        : 
        <p className="error">An error occurred</p>
        }

        </div>
  )
}

export default TournamentWinnersHallOfFame