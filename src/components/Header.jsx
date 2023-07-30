import React from 'react'
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

function Header({leaderboardRef, visualTableRef}) {
    console.log(leaderboardRef)
    console.log(visualTableRef)

    function scrollToTableTop() {
        leaderboardRef.current?.scrollIntoView({behavior: "smooth"});
    }

    function scrollToTableBottom() {
        leaderboardRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
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
                    <li onClick={scrollToTableTop}>Leaderboard</li>
                    <li onClick={scrollToTableBottom}>Visual</li>
                    <li><Link to="/add">New Tournament</Link></li>
                </ul>
            </nav>
        </div>
    </header>
  )
}

export default Header