import axios from "axios";
// import { getLocalStorageToken, TOKEN_NAME } from "../utils/localStorageToken";

export { plansAPI } from "./plans-api";
export { groupsAPI } from "./groups-api";
export { streamsAPI } from "./streams-api";
export { settingsAPI } from "./settings-api";
export { teachersAPI } from "./teachers-api";
export { studentsAPI } from "./students-api";
export { gradeBookAPI } from "./grade-book-api";
export { auditoriesAPI } from "./auditories-api";
export { planSubjectsAPI } from "./plan-subjects-api";
export { teacherProfileAPI } from "./teacher-profile-api";
export { scheduleLessonsAPI } from "./schedule-lessons-api";
export { groupLoadLessonsAPI } from "./group-load-lessons-api";

export const instanse = axios.create({
  baseURL: "http://localhost:7777/",
  withCredentials: true,
});

// // Якщо є токен, вшиваю його в конфігурацію axios
// instanse.interceptors.request.use((config) => {
//   if (config.headers) {
//     const token =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUwODQwMTM3LCJleHAiOjE3NTM0MzIxMzd9.45M1GUnxEarIpr6_t0OvLjrH2UCyuUCRnxQp3A0hJ3M";
//     // const token = getLocalStorageToken()
//     config.headers.Authorization = String(`Bearer ${token}`);

//     // config.headers.Authorization = String(window.localStorage.getItem('token'))
//   }
//   return config;
// });

instanse.interceptors.response.use(
  (response) => response,
  (error) => {
    // Any status codes that fall outside the range of 2xx trigger this function
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/auth") {
        if (typeof window !== "undefined") {
          window.location.replace("/auth");
        }
      }
    }

    // Return the error to be handled elsewhere (if necessary)
    return Promise.reject(error);
  },
);
