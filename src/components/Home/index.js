import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Projects from '../Projects'

import './index.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    activeId: categoriesList[0].id,
    projectList: [],
    isLoading: false,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
        isLoading: true,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getProjectDetails()
  }

  renderFailureView = () => (
    <div className="failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-icon "
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  onSelectOption = e => {
    this.setState({activeId: e.target.value}, () => this.getProjectDetails())
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#cbd5e1" width={50} height={50} />
    </div>
  )

  renderProjectListView = () => {
    const {projectList, isLoading} = this.state
    return (
      <>
        {isLoading ? (
          <ul className="project-item-container">
            {projectList.map(each => (
              <Projects key={each.id} projectList={each} />
            ))}
          </ul>
        ) : (
          this.renderLoadingView()
        )}
      </>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    console.log(activeId)
    return (
      <div>
        <nav className="nav-bar-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-image"
          />
        </nav>
        <div className="body-container">
          <select
            className="option-selection"
            value={activeId}
            onChange={this.onSelectOption}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjects()}
      </div>
    )
  }
}

export default Home
