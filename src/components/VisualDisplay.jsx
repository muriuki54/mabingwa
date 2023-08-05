import React, { forwardRef } from 'react';
import WinConversionGraphic from './WinConversionGraphic';
import GaGfGraphic from './GaGfGraphic';
import ParticipationGraphic from './ParticipationGraphic';

const VisualDisplay = forwardRef(function({players}, ref) {
    // console.log(ref)
    // let outer = useRef();
    // console.log(outer.current?.getTotalLength());
  return (
    <div className="visual-block">
        <div className="container" ref={ref}>
            {/* <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{visibility: "hidden"}}>
                <circle ref={outer} cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#E8E7ED" strokeWidth="10"/>
                <circle cx="55" cy="55" r="50" transform="rotate(-90 55 55)" stroke="#6A5BE1" strokeWidth="10"/>
            </svg> */}

            <h2 className="text-center">Visual representation</h2>
            <p className="text-center"><strong>* Please note that this is not a fair representation as some players have played more tournaments than others as illustrated on the participation donut.</strong></p>
            <p className="text-center">However it's fun to look at donuts so here goes.</p>
            
            <div className="player-visuals-grid">
                {players.map(function(player, index) {
                    return (
                        <div className="player-visuals-card" key={index}>
                            <h2>{player.name}</h2>

                            <div className="player-visuals-card-inner">
                                <div className="player-total-games-percentage text-center">
                                    <small>Participation (played)</small>
                                    <br />
                                    <ParticipationGraphic players={players} player={player} />
                                </div>

                                <div className="player-win-conversion-visual">
                                    <small>Win Conversion</small>
                                    <br />
                                    <WinConversionGraphic player={player} />
                                </div>
                                
                                <div className="player-goal-conversion-visual">
                                    <small><span>GF</span> / <span>GA</span> Ratio</small>
                                    <br />
                                    <GaGfGraphic player={player} />
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