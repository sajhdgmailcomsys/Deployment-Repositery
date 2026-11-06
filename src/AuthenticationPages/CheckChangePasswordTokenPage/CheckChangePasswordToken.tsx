import type React from "react";
import styles from "./CheckChangePasswordToken.module.css";
import { useForm } from "react-hook-form";
import {
  changePassMainSchema,
  type ChangePassMainSchema,
} from "../../Schemas/AuthenticationSchemas/ChangePassMainSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tickMark from "../../assets/TickMark.svg";
import { Link } from "react-router-dom";
import closedEye from "../../assets/Closedeye.png";
import openEye from "../../assets/Openeye.png";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";

type responseType = {
  success: boolean;
  message: string;
};

function CheckChangePasswordToken(): React.JSX.Element {
  const {
    register,
    clearErrors,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassMainSchema>({
    resolver: zodResolver(changePassMainSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const resetPasswordVerificationToken = searchParams.get("token");

  useEffect(() => {
    const handleOnline = () => {
      setIsError(false);
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const onSubmit = async (data: ChangePassMainSchema): Promise<void> => {

    try {
      setIsLoading(true);
      const response = await api.post<responseType>(
        "/api/Authentication/resetpassword",
        {
          Token: resetPasswordVerificationToken,
          NewPassword:data.newPassword
        }
      );

      if (response.status == HttpStatusCode.Ok) {
        reset();
        setIsLoading(false);
        setIsSent(true);
        setIsSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: responseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          setIsLoading(false);
          setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          if(responseData.message==="The newpassword is required."||responseData.message==="The password should be more than 13 characters long and less than 64 characters.")
          {
            setError("newPassword",{message:responseData.message});
            
          }else{
            setIsSent(true);
            setIsSuccess(false);
          }
          
        }
      }
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          display: isSent ? "flex" : "none",
        }}
        className={styles.successbackground}
      >
        <img
          className={`${styles.successimg} ${isSuccess ? styles.isActive : styles.isInactive}`}
          src={tickMark}
          alt="Succeeded"
        />
        <p className={styles.successtext}>
          {isSuccess?
          "Your password has been successfully updated. Please log in to your account using your new credentials.":"It seems like your reset password verification token is either wrong or expired click on the link given below to try again."}
        </p>
        <p className={styles.loginlinktext}>
          Back to{"  "}
          <Link to={isSuccess?"/login":"/changepasswordform"} className={styles.loginlink}>
            {isSuccess? "Login?":"Try again?"}
          </Link>
        </p>
      </div>

      {isLoading ? <LoadingScreen1 isLoading={isLoading}></LoadingScreen1> : ""}
      {<ErrorScreen1 isError={isError}></ErrorScreen1>}
      <div
        style={{
          display: isLoading||isSent ? "none" : "flex",
        }}
        className={styles.background}
      >
        <div className={styles.changepassmainbackground}>
          <p className={styles.firtext}>Reset Password</p>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                border: `1px solid ${errors.newPassword?.message ? "red" : "black"}`,
              }}
            >
              <label htmlFor="password">New Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Password"
                id="password"
                {...register("newPassword", {
                  onChange: () => clearErrors("newPassword"),
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
            {errors.newPassword && (
              <p className={styles.error}>{errors.newPassword.message}</p>
            )}
            <div
              style={{
                border: `1px solid ${errors.confirmPassword?.message ? "red" : "black"}`,
              }}
            >
              <label htmlFor="ConfirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                id="ConfirmPassword"
                {...register("confirmPassword", {
                  onChange: () => clearErrors("confirmPassword"),
                })}
              />
              <button
                className={styles.showpassbutton}
                type="button"
                onClick={() => setshowConfirmPassword((prev) => !prev)}
              >
                <img src={showConfirmPassword ? openEye : closedEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
            <button>Send Instructions</button>
            <Link className={styles.signuplink} to="/signup">
              Sign up?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckChangePasswordToken;
