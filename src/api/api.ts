import jwtDecode from "jwt-decode"
import axios, { AxiosError /* , type AxiosRequestConfig  */ } from "axios"

import { authAPI } from "./auth-api"
export { plansAPI } from "./plans-api"
export { groupsAPI } from "./groups-api"
export { streamsAPI } from "./streams-api"
export { settingsAPI } from "./settings-api"
export { teachersAPI } from "./teachers-api"
export { studentsAPI } from "./students-api"
import type { SessionType } from "./api-types"
export { gradeBookAPI } from "./grade-book-api"
export { auditoriesAPI } from "./auditories-api"
export { planSubjectsAPI } from "./plan-subjects-api"
export { teacherProfileAPI } from "./teacher-profile-api"
export { scheduleLessonsAPI } from "./schedule-lessons-api"
export { groupLoadLessonsAPI } from "./group-load-lessons-api"
import { clearAccessToken, getAccessToken, setAccessToken } from "@/helpers/session"

export const instanse = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

/* 

*/

let refreshTokenPromise: Promise<string | null> | null = null

instanse.interceptors.request.use(
  async (config) => {
    // Пропускаємо публічні запити
    if (config.url?.includes("/auth/refresh") || config.url?.includes("/auth/login")) {
      return config
    }

    const token = getAccessToken()

    // Токен відсутній
    if (!token) {
      window.location.href = "/auth"
      return Promise.reject(new axios.AxiosError("Ви не авторизовані"))
    }

    const session = jwtDecode<SessionType>(token)

    // Термін дії токена ще не вийшов
    if (session.exp > Date.now() / 1000) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    }

    // Термін дії токена вийшов і ще не було запиту на refresh
    if (!refreshTokenPromise) {
      console.log("11111")
      refreshTokenPromise = authAPI
        .refresh()
        .then((res) => {
          const newToken = res?.data.accessToken ?? null
          if (newToken) {
            setAccessToken(newToken)
            config.headers.Authorization = `Bearer ${newToken}`
            return newToken
          } else {
            clearAccessToken()
            return null
          }
        })
        .catch((err) => null)
        .finally(() => (refreshTokenPromise = null))
    }

    // Був запит на refresh - очікуємо результат
    const result = await refreshTokenPromise

    if (!result) {
      window.location.href = "/auth"
      return Promise.reject(new axios.AxiosError("Помилка авторизації"))
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

/* 

*/

/* 

*/

/* 

*/

instanse.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (window.location.pathname === "/auth") {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      window.location.href = "/auth"
    }
    return Promise.reject(error)
  },
)

/* 

*/

/* 

*/

/* 

*/

/* 

*/

/* 

*/

/* 

*/

// Интерсептор для запросов — подставляем токен
// instanse.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

/* 

*/

// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// function onRefreshed(token: string) {
//   refreshSubscribers.forEach((cb) => cb(token));
//   refreshSubscribers = [];
// }

// function addRefreshSubscriber(callback: (token: string) => void) {
//   refreshSubscribers.push(callback);
// }

// instanse.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

//     if (!originalRequest || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           addRefreshSubscriber((token: string) => {
//             if (!token) {
//               reject(error);
//               return;
//             }
//             if (!originalRequest.headers) originalRequest.headers = {};
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(instanse(originalRequest));
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const { data } = await authAPI.refresh();

//         if (data?.accessToken) {
//           setAccessToken(data.accessToken);
//           onRefreshed(data.accessToken);
//           if (!originalRequest.headers) originalRequest.headers = {};
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//           return instanse(originalRequest);
//         }
//       } catch (err) {
//         clearAccessToken();
//         if (typeof window !== "undefined") {
//           window.location.href = "/auth";
//         }
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

//

//

//

//

//

//

// let accessToken: string | null = null;

// // Устанавливаем токен
// export function setAccessToken(token: string | null) {
//   accessToken = token;
// }

// // Request interceptor — добавляет access token
// instanse.interceptors.request.use((config) => {
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// instanse.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     if (!originalRequest || originalRequest._retry) return Promise.reject(error);

//     if (error.response?.status === 401) {
//       originalRequest._retry = true;
//       try {
//         const { data } = await authAPI.refresh();

//         if (data?.accessToken) {
//           setAccessToken(data.accessToken);
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//           return instanse.request(originalRequest);
//         }
//       } catch (e) {
//         // если refresh неудачен — перевести на /auth
//         if (typeof window !== "undefined") window.location.href = "/auth";
//         return Promise.reject(e);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

//

//

//

//

//

//

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

// instanse.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Any status codes that fall outside the range of 2xx trigger this function
//     if (error.response && error.response.status === 401) {
//       if (typeof window !== "undefined") {
//         if (window.location.pathname !== "/auth") {
//           window.location.replace("/auth");
//         }
//       }
//     }

//     // Return the error to be handled elsewhere (if necessary)
//     return Promise.reject(error);
//   },
// );

//

//

//

// instanse.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         const { data } = await axios.get(`${import.meta.env.API_URL}/auth/refresh`, {
//           withCredentials: true,
//         });

//         if (data?.accessToken) {
//           error.config.headers.Authorization = `Bearer ${data.accessToken}`;
//           return instanse.request(error.config);
//         }
//       } catch {
//         if (typeof window !== "undefined") {
//           window.location.href = "/auth";
//         }
//       }
//     }
//     return Promise.reject(error);
//   },
// );
