
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar({ user, userProfile, theme, cycleTheme }) {

  const [open, setOpen] = useState(false);
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(false);

  const t = useTheme();

  const handleLogout = () => {
    auth.signOut();
  };

  const closeDropdown = () => {
    setOpen(false);
    setProfileSubmenuOpen(false);
  };

  const avatarURL = userProfile?.avatarURL || user?.photoURL || "";
  const nickname = userProfile?.nickname || user?.displayName || "User";
  const hasCompletedSetup = userProfile?.hasCompletedSetup || false;

  const hoverEnter = (e) => {
    e.currentTarget.style.background = t.hoverBg;
    e.currentTarget.style.borderRadius = "4px";
    e.currentTarget.style.borderLeft = `3px solid ${t.accent}`;
    e.currentTarget.style.paddingLeft = "0.7rem";
    e.currentTarget.style.boxShadow = `0 0 10px ${t.shadowMd}, inset 0 0 10px ${t.shadowXs}`;
  };

  const hoverLeave = (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.borderRadius = "0";
    e.currentTarget.style.borderLeft = "none";
    e.currentTarget.style.paddingLeft = "0.5rem";
    e.currentTarget.style.boxShadow = "none";
  };

  return (

    <nav className="navbar">

      <div className="logo">RIVALIS Hub</div>

      <div className="nav-right">

        <button
          onClick={cycleTheme}
          className="theme-toggle-btn"
          style={{
            width: "40px",
            height: "40px",
            fontSize: "1.2rem",
          }}
        >
          {theme === "red-black" ? "🔴" : theme === "white-black" ? "⚪" : "⚫"}
        </button>

        {hasCompletedSetup && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

            {avatarURL && (
              <img
                src={avatarURL}
                alt={nickname}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#fff",
                  border: `2px solid ${t.accent}`
                }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>
                {nickname}
              </span>

              <span style={{ color: t.accent, fontSize: "10px", marginTop: "2px" }}>
                🎟 {userProfile?.ticketBalance ?? 0}
              </span>
            </div>

          </div>
        )}

        <div className="menu">

          <button onClick={() => setOpen(!open)}>Menu</button>

          {open && (

            <div className="dropdown">

              <Link to="/dashboard" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                Home
              </Link>

              <div style={{ position: "relative" }}>

                <button
                  onClick={() => setProfileSubmenuOpen(!profileSubmenuOpen)}
                  style={{
                    color: "#fff",
                    padding: "0.5rem",
                    background: "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left"
                  }}
                  onMouseEnter={hoverEnter}
                  onMouseLeave={hoverLeave}
                >
                  Profile {profileSubmenuOpen ? "▼" : "▶"}
                </button>

                {profileSubmenuOpen && (

                  <div
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "0",
                      background: "#000000",
                      border: `1px solid ${t.accent}`,
                      borderRadius: "8px",
                      padding: "0.5rem",
                      marginLeft: "0.5rem",
                      minWidth: "160px",
                      zIndex: 10000
                    }}
                  >

                    <Link to="/profile" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                      View Profile
                    </Link>

                    <Link to="/settings" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                      Settings
                    </Link>

                  </div>

                )}

              </div>

              <Link to="/fitness" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                Fitness Dashboard
              </Link>

              <Link to="/chat" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                Chat
              </Link>

              <Link to="/dm" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                DM
              </Link>

              <Link to="/leaderboard" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                Leaderboard
              </Link>

              {userProfile?.isAdmin && (
                <Link
                  to="/admin-control"
                  onClick={closeDropdown}
                  onMouseEnter={hoverEnter}
                  onMouseLeave={hoverLeave}
                  style={{ color: t.accent, fontWeight: "bold" }}
                >
                  Admin Console
                </Link>
              )}

              <Link to="/shop" onClick={closeDropdown} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
                Shop
              </Link>

              <button onClick={() => { handleLogout(); closeDropdown(); }}>
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>

  );

}

