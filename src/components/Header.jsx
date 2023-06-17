import React from 'react'
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

function Header({leaderboardRef}) {
    function scrollToTable() {
        leaderboardRef.current?.scrollIntoView({behavior: "smooth"});
    }

  return (
    <header>
        <div className="container">
            <div className="logo">
                <Link to="/"><img src={logo} alt="" /></Link>
            </div>

            <nav>
                <ul>
                    <li><Link to="/">Hall of fame</Link></li>
                    <li onClick={scrollToTable}>Leaderboard</li>
                    <li><Link to="/add">New Tournament</Link></li>
                </ul>
            </nav>
        </div>
    </header>
  )
}

export default Header