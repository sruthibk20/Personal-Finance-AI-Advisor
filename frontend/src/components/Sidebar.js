import { Link } from "react-router-dom";
import "./Sidebar.css";

function FinanceLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="52" height="52" rx="16" fill="#1E293B" />
      <path d="M18 42L28 32L35 39L46 22" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 22H46V26" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 48H46" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (

    <div className="sidebar">

      <div>
        <div className="sidebar-brand">
          <FinanceLogo />
          <div className="logo">FinanceAI</div>
        </div>

        <Link to="/profile" className="profile-preview">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-avatar-image" />
            ) : (
              <span>{(user.name || "F").charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="profile-preview-text">
            <strong>{user.name || "User"}</strong>
            <span>View Profile</span>
          </div>
        </Link>

        <nav className="menu">

          <Link to="/dashboard">Dashboard</Link>

          <Link to="/transactions">Transactions</Link>

          <Link to="/budget">Budget</Link>

          <Link to="/profile">Profile</Link>

        </nav>
      </div>

      <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/";
        }}
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;
