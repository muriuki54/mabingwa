import React, { forwardRef } from 'react';

const VisualDisplay = forwardRef(function({players}, ref) {
    console.log(ref)
    // let outer = useRef();
    // console.log(outer.current?.getTotalLength());

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
        return Math.round((won / played) * 100);
    }

    function GARatio(gf, ga) {
        let goalsFor = Number(gf);
        let goalsAgainst = Number(ga);
        let total = goalsFor + goalsAgainst;
        return pathLength - (goalsAgainst / total) * pathLength;
    }

  return (
    <div className="visual-block">
        <div className="container" ref={ref}>
            {/* <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{visibility: "hidden"}}>
                <circle ref={outer} cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#E8E7ED" strokeWidth="10"/>
                <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10"/>
            </svg> */}

            <h2 className="text-center">Visual representation</h2>

            <div className="player-visuals-grid">
                {players.map(function(player, index) {
                    return (
                        <div className="player-visuals-card" key={index}>
                            <h2>{player.name}</h2>
                            
                            <div className="player-visuals-card-inner">
                                <div className="player-win-conversion-visual">
                                    <small>Win Conversion</small>
                                    <br />
                                    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#E8E7ED" strokeWidth="10" strokeLinejoin="round" />
                                        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10" strokeDasharray={getDashArray()} strokeDashoffset={getDashOffset(player.played, player.won)} strokeLinecap="round" />
                                        <text fill="black" fontFamily="Sans-serif" fontSize="24" letterSpacing="0em"><tspan x="25" y="63.2273">{getConversionPercentage(player.played, player.won)} %</tspan></text>
                                    </svg>
                                </div>
                                
                                <div className="player-goal-conversion-visual">
                                    <small><span>GF</span> / <span>GA</span> Ratio</small>
                                    <br />
                                    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10" />
                                        <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#F37474" strokeWidth="10" strokeDasharray={getDashArray()} strokeDashoffset={GARatio(player.gf, player.ga)} />
                                        <text fill="black" fontFamily="Sans-serif" fontSize="16" letterSpacing="0em"><tspan x="25" y="63.2273">GF / GA</tspan></text>
                                    </svg>
                                </div>
                            </div>                        
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
})

export default VisualDisplay