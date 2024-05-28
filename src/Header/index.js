import Cookies from 'js-cookie'

import {withRouter, Link} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="top-container">
      <Link to="/" className="link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <div className="home-job-container">
        <Link to="/" className="link">
          <p className="home">Home</p>
        </Link>
        <Link to="/jobs" className="link">
          <p className="home">Jobs</p>
        </Link>
      </div>
      <button
        type="button"
        className="logout-button"
        onClick={onClickLogoutButton}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
