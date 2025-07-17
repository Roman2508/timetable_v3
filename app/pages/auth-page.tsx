import { useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { Card } from "~/components/ui/common/card";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { useAppDispatch } from "~/store/store";
import { authLogin, googleLogin } from "~/store/auth/auth-async-actions";
import { authAPI } from "~/api/auth-api";
import { Separator } from "~/components/ui/common/separator";

const formFields = [
  { label: "Логін*", key: "email", type: "email" },
  { label: "Пароль*", key: "password", type: "password" },
];

const defaultFormData = { email: "", password: "" };

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const login = async () => {
    try {
      setIsFetching(true);
      const { payload } = await dispatch(authLogin(formData));

      // const { data } = await authAPI.login(formData);

      if (payload) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID || ""}>
      <RootContainer classNames="!max-w-120">
        <Card className="px-10 pb-12 my-10 flex flex-col items-center gap-0">
          <img src="https://api.pharm.zt.ua:9443/uploads/Zh_BFFK_logotip_kolorovij_192d386e74.png" className="w-25" />

          <h1 className="text-lg font-semibold mb-0 text-center mt-4 leading-5 whitespace-nowrap">
            Житомирський базовий фармацевтичний
            <br /> фаховий коледж
          </h1>
          <h2 className="text-md font-semibold mb-5 opacity-[0.5]">Житомирської обласної ради</h2>

          <div className="w-full">
            {formFields.map((input) => (
              <div className="mb-4" key={input.label}>
                <h5 className="font-semibold text-md">{input.label}</h5>

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
              className="w-full mb-4"
              onClick={login}
              disabled={!formData.email || !formData.password || isFetching}
            >
              {isFetching ? "Завантаження..." : "Увійти"}
            </Button>

            {/* <p className="text-center mb-4">або увійти за допомогою Google</p> */}

            {/* <div className="flex items-center gap-2 mb-4">
              <Separator orientation="horizontal" className="flex-1" />
              <p className="">або</p>
              <Separator orientation="horizontal" className="flex-1" />
            </div> */}

            <GoogleLogin
              width="100%"
              onSuccess={async (credentialResponse) => {
                const decoded = jwt_decode(credentialResponse.credential || "");
                const googleResponse = decoded as any;

                if (!Object.keys(googleResponse).length) {
                  console.log(googleResponse);
                  // dispatch(
                  //   setAppAlert({
                  //     message: "Помилка авторизації!",
                  //     status: "error",
                  //   }),
                  // );
                  return;
                }

                // const { payload } = await dispatch(googleLogin({ email: googleResponse.email }));
                // const response = payload as AuthResponseType;
                // if (response.accessToken) setLocalStorageToken(response.accessToken);
                navigate("/");
              }}
            />
          </div>
        </Card>
      </RootContainer>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
