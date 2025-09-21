// import { useState } from "react";
// import jwtDecode from "jwt-decode";

// import { useAppDispatch } from "@/store/store";
// import { setUser } from "@/store/auth/auth-slice";
// import type { UserType } from "@/store/auth/auth-types";
// import { clearAccessToken, getAccessToken, setAccessToken } from "@/helpers/session";
// import { authAPI } from "@/api/auth-api";
// import type { AxiosResponse } from "axios";

// type Session = {
//   user: UserType;
//   exp: number;
//   iat: number;
// };

// let refreshTokenPromise: Promise<string | AxiosResponse<{ accessToken: string }, any> | null> | null = null;

// export const useSession = () => {
//   const dispatch = useAppDispatch();

//   const [token, setToken] = useState<string | null>(getAccessToken());

//   const login = (token: string) => {
//     setAccessToken(token);
//     setToken(token);
//   };

//   const logout = () => {
//     clearAccessToken();
//     setToken(null);
//   };

//   const session = token ? jwtDecode<Session>(token) : null;

//   // При оновленні сторінки беру токен з локал стореджа, декодую і діспатчу в редакс стор
//   if (session && session.user) {
//     dispatch(setUser(session.user));
//   }

//   const refreshToken = async () => {
//     if (!token) return null;

//     const session = jwtDecode<Session>(token);

//     if (session.exp < Date.now() / 1000) {
//       if (!refreshTokenPromise) {
//         refreshTokenPromise = authAPI
//           .refresh()
//           .then((res) => res?.data.accessToken ?? null)
//           .then((newToken) => {
//             if (newToken) {
//               login(newToken);
//               return newToken;
//             } else {
//               logout();
//               return null;
//             }
//           })
//           .finally(() => {
//             refreshTokenPromise = null;
//           });
//       }

//       const newToken = await refreshTokenPromise;

//       if (newToken) return newToken;
//       else return newToken;
//     }
//   };

//   return { login, logout, refreshToken, session };
// };
