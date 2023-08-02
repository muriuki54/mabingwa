import React from 'react'

function GaGfGraphic({player}) {
    let pathLength = 313.6517639160156 // stroke length for SVG

    function getDashArray() {
        return pathLength;
    }

    function GARatio(gf, ga) {
        let goalsFor = Number(gf);
        let goalsAgainst = Number(ga);
        let total = goalsFor + goalsAgainst;
        return pathLength - (goalsAgainst / total) * pathLength;
    }

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10" />
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#F37474" strokeWidth="10" strokeDasharray={getDashArray()} strokeDashoffset={GARatio(player.gf, player.ga)} />
        <text fill="black" fontFamily="Sans-serif" fontSize="16" letterSpacing="0em"><tspan x="25" y="63.2273">GF / GA</tspan></text>
    </svg>
  )
}

export default GaGfGraphic