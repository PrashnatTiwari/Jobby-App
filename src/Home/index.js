import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = props => {
  const {history} = props
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    history.replace('/login')
  }
  return (
    <>
      <Header />
      <div className="home-data-container">
        <div className="data-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-paragraph">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and potential
          </p>
          <Link to="/jobs">
            <button type="button" className="find-job-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
