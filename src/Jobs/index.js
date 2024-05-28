import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link, Redirect} from 'react-router-dom'
import {AiOutlineSearch, AiFillStar} from 'react-icons/ai'

import {MdLocationOn, MdWork} from 'react-icons/md'

import Cookies from 'js-cookie'

import Header from '../Header'

import LabelAndCheckbox from '../labelAndCheckbox'

import LabelAndRadio from '../labelAndRadio'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    apiProfileStatus: apiStatusConstant.initial,
    apiJobStatus: apiStatusConstant.initial,
    searchInput: '',
    activeSalaryRangeId: '',
    activeCheckboxList: [],
    jobsData: [],
    profileData: {},
  }

  componentDidMount() {
    this.getJobsData()
    this.getProfileData()
  }

  onClickProfileRetryButton = () => {
    this.getProfileData()
  }

  onClickFailureRetryButton = () => {
    this.setState(
      {
        searchInput: '',
      },
      this.getJobsData(),
    )
  }

  getJobsData = async () => {
    this.setState({
      apiJobStatus: apiStatusConstant.inProgress,
    })
    const {searchInput, activeCheckboxList, activeSalaryRangeId} = this.state

    const type = activeCheckboxList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        title: eachItem.title,
        rating: eachItem.rating,
      }))
      this.setState({
        jobsData: updatedData,
        apiJobStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiStatusConstant.failure,
      })
    }
  }

  getFormattedData = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    bio: data.short_bio,
  })

  getProfileData = async () => {
    this.setState({
      apiProfileStatus: apiStatusConstant.inProgress,
    })
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.profile_details)
      this.setState({
        profileData: updatedData,
        apiProfileStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiProfileStatus: apiStatusConstant.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectSalaryRange = event => {
    this.setState(
      {
        activeSalaryRangeId: event.target.id,
      },
      this.getJobsData,
    )
  }

  onClickCheckbox = event => {
    const {activeCheckboxList} = this.state
    if (activeCheckboxList.includes(event.target.id)) {
      const updatedList = activeCheckboxList.filter(
        each => each !== event.target.id,
      )
      this.setState(
        {
          activeCheckboxList: updatedList,
        },
        this.getJobsData,
      )
    } else {
      this.setState(
        prevState => ({
          activeCheckboxList: [
            ...prevState.activeCheckboxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, bio} = profileData
    return (
      <div className="profile-container">
        <div className="profile-image-container">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
        </div>
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-paragraph">{bio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <button
      type="button"
      onClick={this.onClickProfileRetryButton}
      className="retry-button"
    >
      Retry
    </button>
  )

  renderAllProfileComponent = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiStatusConstant.success:
        return this.renderProfileSuccessView()
      case apiStatusConstant.failure:
        return this.renderProfileFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderDashboardContainer = () => (
    <div className="dashboard-container">
      {this.renderAllProfileComponent()}
      <div className="dashboard-topic-container">
        <hr className="horizontal-line" />
        <h1 className="dashboard-topic">Type of Employment</h1>
        {employmentTypesList.map(eachItem => (
          <LabelAndCheckbox
            key={eachItem.employmentTypeId}
            itemDetails={eachItem}
            onClickCheckbox={this.onClickCheckbox}
          />
        ))}
      </div>
      <div className="dashboard-topic-container">
        <hr className="horizontal-line" />
        <h1 className="dashboard-topic">Salary Range</h1>
        {salaryRangesList.map(eachItem => (
          <LabelAndRadio
            itemDetails={eachItem}
            onSelectSalaryRange={this.onSelectSalaryRange}
            key={eachItem.salaryRangeId}
          />
        ))}
      </div>
    </div>
  )

  renderSearchContainer = () => (
    <div className="search-input-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search"
        onChange={this.onChangeSearchInput}
        onKeyDown={this.onEnterSearchInput}
      />
      <button
        data-testid="searchButton"
        type="button"
        className="search-button"
        onClick={this.onSubmitSearchInput}
      >
        <AiOutlineSearch className="search-icon" />
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobsData} = this.state
    return (
      <>
        {jobsData.map(eachItem => (
          <Link to={`/jobs/${eachItem.id}`} className="link">
            <div className="job-data-card-container">
              <div className="job-logo-rating-container">
                <img
                  src={eachItem.companyLogoUrl}
                  className="job-company-logo"
                  alt="company logo"
                />
                <div className="description-container">
                  <h1 className="job-title">{eachItem.title}</h1>
                  <div className="rating-container">
                    <AiFillStar color="yellow" />
                    <p>{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-employment-type-salary-container">
                <div className="location-employment-type-container">
                  <div className="loaction-container">
                    <MdLocationOn />
                    <p className="job-location-name">{eachItem.location}</p>
                  </div>
                  <div className="loaction-container">
                    <MdWork />
                    <p className="job-location-name">
                      {eachItem.employmentType}
                    </p>
                  </div>
                </div>
                <p className="job-package">{eachItem.packagePerAnnum}</p>
              </div>
              <hr className="job-horizontal-line" />
              <h1 className="job-description-paragraph">Description</h1>
              <p className="job-description">{eachItem.jobDescription}</p>
            </div>
          </Link>
        ))}
      </>
    )
  }

  renderLoadingView = () => (
    <div className="jobs-description-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-detail-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-heading">
        We cannot seem to find the page you are lokking for.
      </p>
      <button
        type="button"
        className="logout-button"
        onClick={this.onClickFailureRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderAllComponent = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          {this.renderDashboardContainer()}
          <div className="search-successView">
            {this.renderSearchContainer()}
            {this.renderAllComponent()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
