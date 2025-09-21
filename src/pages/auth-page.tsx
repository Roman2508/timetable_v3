import { useState } from "react"
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router"
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from "@react-oauth/google"

import logo from "@/assets/logo.png"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { Input } from "@/components/ui/common/input"
import { Button } from "@/components/ui/common/button"
import { setAppAlert } from "@/store/app-status/app-status-slice"
import { RootContainer } from "@/components/layouts/root-container"
import { authLogin, googleLogin } from "@/store/auth/auth-async-actions"

const formFields = [
  { label: "Логін*", key: "email", type: "email" },
  { label: "Пароль*", key: "password", type: "password" },
] as const

const defaultFormData = { email: "", password: "" }

const AuthPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)

  const onLogin = async () => {
    try {
      setIsFetching(true)
      console.log(formData)
      const { payload } = await dispatch(authLogin(formData))

      if (payload) {
        setIsLoggedIn(true)
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const onGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential || "")
    const googleResponse = decoded as any

    if (!Object.keys(googleResponse).length) {
      console.log(googleResponse)
      dispatch(setAppAlert({ message: "Помилка авторизації!", status: "error" }))
      return
    }

    const { payload } = await dispatch(googleLogin({ email: googleResponse.email }))
    console.log(payload)
    if (payload) navigate("/")
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || ""}>
      <RootContainer classNames="!max-w-120">
        <div className="flex flex-col items-center justify-center h-full mt-[10vh] mb-10">
          <img src={logo} alt="logo" className="w-25" />

          <h1 className="text-lg font-semibold mb-0 text-center mt-4 leading-5 whitespace-nowrap">
            Житомирський базовий фармацевтичний
            <br /> фаховий коледж
          </h1>
          <h2 className="text-md font-semibold opacity-[0.5] mb-4">Житомирської обласної ради</h2>

          <Card className="px-8 pb-12 flex flex-col items-center gap-0">
            <div className="w-full">
              {formFields.map((input) => (
                <div className="mb-4 w-[243px]" key={input.label}>
                  <h5 className="font-semibold text-sm">{input.label}</h5>

                  <Input
                    type={input.type}
                    className="w-full"
                    value={formData[input.key as keyof typeof formData]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [input.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 w-full">
              <Button
                onClick={onLogin}
                className="w-full mb-4"
                disabled={!formData.email || !formData.password || isFetching || isLoggedIn}
              >
                {isFetching || isLoggedIn ? "Завантаження..." : "Увійти"}
              </Button>

              <GoogleLogin
                width="100%"
                // ux_mode="redirect"
                onSuccess={onGoogleLogin}
                containerProps={{ className: "w-full" }}
              />
            </div>
          </Card>
        </div>
      </RootContainer>
    </GoogleOAuthProvider>
  )
}

export default AuthPage
