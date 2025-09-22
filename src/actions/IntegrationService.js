import axios from 'axios'

class IntegrationService {

  constructor() {
    this.fieldapURL = import.meta.env.VITE_FIELDAP_API_BASE_URL
  }

  setProject(projectId, subProjectId) {
    this.projectId = projectId
    const subProjectIdNoEvents = subProjectId.split(':')[0]
    this.subProjectId = subProjectIdNoEvents
  }

  setJWT(jwt) {
    this.jwt = jwt;
  }

  async getConnections() {
    const response = await axios.get(
      `${this.fieldapURL}/API/v1.10/${this.projectId}/subProject/${this.subProjectId}/connections`,
      {
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      }
    )
    return response.data
  }
}

// This is the exported instance of the data service
export default new IntegrationService()