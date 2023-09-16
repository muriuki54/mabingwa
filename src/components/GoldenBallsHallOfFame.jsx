import React from 'react';
import loading from "../assets/loading.svg";
import profile from "../assets/profile.jpg";
import optimus from "../assets/optimus.png";
import bee from "../assets/bee.jpg";
import mirage from "../assets/mirage.jpg";
import crown from "../assets/crown.png";

function GoldenBallsHallOfFame({goldenbootsHallOfFamers, season, error}) {
    function getProfile(index) {
        switch(index) {
            case 0:
                return optimus;
            case 1:
                return bee;
            case 2:
                return mirage;
            default:
                return profile;
        }
    }
  return (
    <div className="container hall-fame-tab">
        {! error ? 
        <>
        <h1 className="text-center tab-entry-title">{season.split("_").join(" ")} FIFA <span className="text-shadow">Golden Boots</span> Hall of fame</h1>
        <hr />
        {goldenbootsHallOfFamers.length > 0 ? 
        <div className="members">
        {goldenbootsHallOfFamers.map(function(player, index) {
            return(
                <div className={index === 0 ? "member member-big rank-"+(index+1) : "member member-small rank-"+(index+1)} key={index}>{/* Member */}
                    <img src={getProfile(index)} alt="" className="profile-pic" />
                    <h2 className="hall-of-famer">{player.name}</h2>
                    <small>Golden Boots</small>
                    <p className="wins">{player.goldenboot}</p>
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

export default GoldenBallsHallOfFame