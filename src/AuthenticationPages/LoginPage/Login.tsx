import { loginSchema } from "../../Schemas/AuthenticationSchemas/LoginSchema";
import type { LoginSchema } from "../../Schemas/AuthenticationSchemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import closedEye from "../../assets/Closedeye.png";
import openEye from "../../assets/Openeye.png";
import styles from "./Login.module.css";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
type responseType = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};
function Login(): React.JSX.Element {
  const {
    register,
    clearErrors,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsError(false);
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const onSubmit = async (data: LoginSchema): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<responseType>(
        "/api/Authentication/login",
        {
          Email: data.email,
          Password: data.password,
        },
      );
      if (response.status === HttpStatusCode.Ok) {
        reset();
        const isUserSignedUp = JSON.parse(
          localStorage.getItem("hasUserSignedUp") ?? "null",
        );
        if (isUserSignedUp === null) {
          localStorage.setItem("hasUserSignedUp", "true");
        }
        localStorage.setItem("accessToken", response.data.data.accessToken);

        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: responseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          if (responseData.message === "Please verify your email first.") {
            navigate("/EmailNotVerifiedYetForm");
          } else if (
            responseData.message === "Your account has been disabled."
          ) {
            navigate(`/error?errorCode=503&message=${responseData.message}`);
          } else {
            setIsLoading(false);
            setError("password", {
              type: "server",
              message: responseData.message,
            });
          }
        }
      }
    }
  };
  

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {isLoading ? (
        <LoadingScreen1
          message="Logging in..."
          isLoading={isLoading}
        ></LoadingScreen1>
      ) : (
        ""
      )}
      {isError ? <ErrorScreen1 isError={isError}></ErrorScreen1> : ""}

      <div
        style={{
          opacity: isLoading ? 0 : 1,
          inset: 0,
          transition: "all 0.4s ease",
          pointerEvents: isLoading ? "none" : "auto",
          transform: isLoading
            ? "perspective(500px) translateZ(-50px)"
            : "perspective(500px) translateZ(0)",
        }}
        className={styles.loginbackground}
      >
        <div className={styles.loginscreen}>
          <p className={styles.firtext}>Login</p>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div id={styles.emailbox}>
              <label htmlFor="email">Email:</label>
              <input
                autoComplete="username"
                type="email"
                placeholder="Email"
                id="email"
                {...register("email", { onChange: () => clearErrors("email") })}
              />
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
            <div>
              <label htmlFor="password">Password:</label>
              <input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                {...register("password", {
                  onChange: () => clearErrors("password"),
                })}
              />
              <button
                className={styles.showpassbutton}
                type="button"
                onClick={() => setshowPassword((prev) => !prev)}
              >
                <img src={showPassword ? openEye : closedEye} />
              </button>
            </div>
            <Link className={styles.forgpasslink} to="/changepasswordform">
              Forgot Password?
            </Link>{" "}
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
            <button className={styles.loginbutton} type="submit">
              login
            </button>
          </form>
          <p className={styles.alternativemethod}>
            Don't have an account?
            <Link className={styles.signuplink} to="/signup">
              Singup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
