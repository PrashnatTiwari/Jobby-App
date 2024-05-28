import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class JobDetailData extends Component {
  state = {
    jobsDetailData: {},
    lifeAtCompanyData: {},
    companySkillsData: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  onClickRetryButton = () => {
    this.getProductData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    description: data.description,
    imageUrl: data.image_url,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    skillName: data.name,
    id: data.id,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updateLifeAtCompanyData = this.getFormattedData(
        fetchedData.job_details.life_at_company,
      )
      const updatedCompanySkillsData = fetchedData.job_details.skills.map(
        eachSkill => this.getFormattedData(eachSkill),
      )
      const updateSimilarJobsData = fetchedData.similar_jobs.map(eachItem =>
        this.getFormattedData(eachItem),
      )
      this.setState({
        jobsDetailData: updatedData,
        lifeAtCompanyData: updateLifeAtCompanyData,
        companySkillsData: updatedCompanySkillsData,
        similarJobsData: updateSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="job-detail-Loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p className="product-not-found-paragraph">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="logout-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {
      jobsDetailData,
      companySkillsData,
      lifeAtCompanyData,
      similarJobsData,
    } = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      employmentType,
      packagePerAnnum,
      location,
      jobDescription,
    } = jobsDetailData

    const {description, imageUrl} = lifeAtCompanyData

    return (
      <div className="job-details-main-container">
        <div className="job-detail-data-card-container">
          <div className="job-logo-rating-container">
            <img
              src={companyLogoUrl}
              className="job-company-logo"
              alt="job details company logo"
            />
            <div className="description-container">
              <p className="job-title">{title}</p>
              <div className="rating-container">
                <AiFillStar color="yellow" />
                <p>4</p>
              </div>
            </div>
          </div>
          <div className="job-details-location-employment-type-salary-container">
            <div className="location-employment-type-container">
              <div className="loaction-container">
                <MdLocationOn />
                <p className="job-location-name">{location}</p>
              </div>
              <div className="loaction-container">
                <MdWork />
                <p className="job-location-name">{employmentType}</p>
              </div>
            </div>
            <p className="job-package">{packagePerAnnum}</p>
          </div>
          <hr className="job-details-horizontal-line" />
          <div className="visit-link-container">
            <h1 className="job-description-paragraph">Description</h1>
            <Link to={`${companyWebsiteUrl}`} className="visit-link">
              Visit
            </Link>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skill">Skills</h1>
          <ul className="unordered-skill-list">
            {companySkillsData.map(eachItem => (
              <li className="skills-list-item">
                <img
                  src={eachItem.imageUrl}
                  className="skill-image"
                  alt={eachItem.name}
                />
                <p className="skill-name">{eachItem.skillName}</p>
              </li>
            ))}
          </ul>
          <p className="skill">Life at Company</p>
          <div className="life-at-company-description">
            <p className="skills-description">{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
        </div>
        <div className="similar-job-container">
          <p className="skill">Similar jobs</p>
          <ul className="unordered-similar-job-list">
            {similarJobsData.map(eachItem => (
              <li className="similar-job-list-item">
                <div className="job-logo-rating-container">
                  <img
                    src={eachItem.companyLogoUrl}
                    className="job-company-logo"
                    alt="similar job company logo"
                  />
                  <div className="description-container">
                    <h1 className="job-title">{eachItem.title}</h1>
                    <div className="rating-container">
                      <AiFillStar color="yellow" />
                      <p>{eachItem.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="job-description-paragraph">Description</h1>
                <p className="job-description">{eachItem.jobDescription}</p>
                <div className="similar-jobs-location-employment-type-container">
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
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
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default JobDetailData
