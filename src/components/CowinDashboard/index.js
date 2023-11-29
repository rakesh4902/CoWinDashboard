// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByCoverage from '../VaccinationCoverage'

import './index.css'

const apiContent = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: {},
    apiStatus: apiContent.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiContent.inprogress,
    })
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachData => ({
            vaccineDate: eachData.vaccine_date,
            dose1: eachData.dose_1,
            dose2: eachData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachRange => ({
          age: eachRange.age,
          count: eachRange.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachData => ({
            gender: eachData.gender,
            count: eachData.count,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiContent.success,
      })
    } else {
      this.setState({
        apiStatus: apiContent.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {vaccinationData} = this.state
    console.log(vaccinationData)
    return (
      <>
        <VaccinationByCoverage
          vaccinationByCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failureImg"
      />
      <h1 className="failureHead">Something went wrong</h1>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loaderStyle">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderViewsBasedOnAPIS = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiContent.success:
        console.log('success component')
        return this.renderSuccessView()
      case apiContent.failure:
        return this.renderFailureView()
      case apiContent.inprogress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus, vaccinationData} = this.state
    console.log(apiStatus)
    console.log(vaccinationData)
    return (
      <div className="appCont">
        <div className="coWinHead">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            className="webLogo"
            alt="website logo"
          />
          <h1 className="head1">Co-WIN</h1>
        </div>
        <h1 className="head2">CoWIN Vaccination in India</h1>
        {this.renderViewsBasedOnAPIS()}
      </div>
    )
  }
}

export default CowinDashboard
