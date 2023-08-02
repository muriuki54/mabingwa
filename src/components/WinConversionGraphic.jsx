import React from 'react'

function WinConversionGraphic({player}) {
    let pathLength = 313.6517639160156 // stroke length for SVG

    function getDashArray() {
        return pathLength;
    }
    
    function getDashOffset(p ,w) {
        let played = Number(p);
        let won = Number(w);
        return pathLength - (won / played) * pathLength;
    }


    function  getConversionPercentage(p, w) {
        let played = Number(p);
        let won = Number(w);
        return Math.round((won / played) * 100) + "%";
    }

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#E8E7ED" strokeWidth="10" strokeLinejoin="round" />
        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10" strokeDasharray={getDashArray()} strokeDashoffset={getDashOffset(player.played, player.won)} strokeLinecap="round" />
        <text fill="black" fontFamily="Sans-serif" fontSize="24" letterSpacing="0em"><tspan x="35" y="63.2273">{getConversionPercentage(player.played, player.won)}</tspan></text>
    </svg>
  )
}

export default WinConversionGraphic