import React from 'react'

function ParticipationGraphic({players, player}) {
    let pathLength = 313.6517639160156 // stroke length for SVG
    let totalGames = 0;
    for(let i = 0; i < players.length; i++) {
        if(Number(players[i].played) > totalGames) totalGames = players[i].played;
    }

    function getDasharray() {
        return pathLength;
    }

    function getDashoffset(played) {
        return Number(played) ? pathLength :  pathLength - (played / totalGames) * pathLength;
    }

    function getParticipationPercentage(participated) {
        return Number(participated) === 0 ? 0 + "%" : Math.round((participated / totalGames) * 100) + "%";
    }

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#E8E7ED" strokeWidth="10"/>
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" strokeDasharray={getDasharray()} strokeDashoffset={getDashoffset(player.played)} stroke="#6A5BE1" strokeWidth="10" strokeLinecap="round" />
        <text fill="black" fontFamily="Sans-serif" fontSize="24" letterSpacing="0em"><tspan x="30" y="56.2273">{getParticipationPercentage(player.played)}</tspan></text>
        <text fill="black" fontFamily="Sans-serif" fontSize="12" letterSpacing="0em"><tspan x="42" y="73.8636">{player.played} / {totalGames}</tspan></text>
    </svg>
  )
}

export default ParticipationGraphic