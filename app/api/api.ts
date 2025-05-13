import axios from 'axios'
import { getLocalStorageToken, TOKEN_NAME } from '../utils/localStorageToken'

export { plansAPI } from './plansAPI'
export { groupsAPI } from './groupsAPI'
export { streamsAPI } from './streamsAPI'
export { settingsAPI } from './settingsAPI'
export { teachersAPI } from './teachersAPI'
export { studentsAPI } from './studentsAPI'
export { gradeBookAPI } from './gradeBookAPI'
export { auditoriesAPI } from './auditoriesAPI'
export { planSubjectsAPI } from './planSubjectsAPI'
export { teacherProfileAPI } from './teacherProfileAPI'
export { scheduleLessonsAPI } from './scheduleLessonsAPI'
export { groupLoadLessonsAPI } from './groupLoadLessonsAPI'

export const instanse = axios.create({
  baseURL: 'http://localhost:7777/',
  // headers: {
  //   ['Content-Type']: 'application/json',
  //   responseType: 'json',
  // },
  // baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4444/' : 'https://timetable-server.onrender.com/',
})

// Якщо є токен, вшиваю його в конфігурацію axios
instanse.interceptors.request.use((config) => {
  if (config.headers) {
    const token = getLocalStorageToken()
    config.headers.Authorization = String(`Bearer ${token}`)
    // config.headers.Authorization = String(window.localStorage.getItem('token'))
  }
  return config
})

instanse.interceptors.response.use(
  (response) => response,
  (error) => {
    // Any status codes that fall outside the range of 2xx trigger this function
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/auth') {
        window.location.replace('/auth')
      }
      // localStorage.removeItem(TOKEN_NAME)
    }

    // Return the error to be handled elsewhere (if necessary)
    return Promise.reject(error)
  }
)
