import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./CheckVerifyEmailToken.module.css";
import tickMark from "../../assets/TickMark.svg";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { useNavigate } from "react-router-dom";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import errorIcon from "../../assets/ErrorIcon.png";

type responseType = {
  success: boolean; 
  message: string;
  data: {
    accessToken: string;
  };
};

function CheckVerifyEmailToken(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const emailVerificationtoken = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsError(false);
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  useEffect(() => {
    const checkEmailVerificationToken = async () => {
      try {
        setIsLoading(true);
        const response = await api.post<responseType>(
          "/api/Authentication/verifyemail",
          {
            Token: emailVerificationtoken,
          },
        );

        if (response.status == HttpStatusCode.Ok) {
          setIsLoading(false);
          setIsSuccess(true);
          localStorage.setItem("accessToken", response.data.data.accessToken);

        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData: responseType = error.response?.data;

          if (error.code === "ERR_NETWORK") {
            setIsLoading(false);
            setIsError(true);
          }
          if (error.status === HttpStatusCode.BadRequest) {
            if(responseData.message==="Your account has been disabled.")
            {
              navigate(`/error?errorCode=503&message=${encodeURIComponent(responseData.message)}`);
            }
            else if(responseData.message==="Email is already verified.")
            {
              setIsLoading(false);
              setIsSuccess(true);
            }else{
              setIsLoading(false);
              setIsSuccess(false);
            }
          }
        }
      }
    };

    checkEmailVerificationToken();
  }, [emailVerificationtoken,navigate]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow:"hidden" }}>
      {
        <LoadingScreen1
          isLoading={isLoading}
        ></LoadingScreen1>}
      {<ErrorScreen1 isError={isError}></ErrorScreen1>}

      <div
        style={{
          display: isLoading ? "none" : "flex",
        }}
        className={styles.background}
      >
        <div className={styles.successscreen}>
          <img src={isSuccess? tickMark:errorIcon} alt={isSuccess? "Verification Successfull":"Verification failed"} />
          <div>
            { isSuccess?
            "Your email has been verified successfully! You can now access all of our services and start creating orders. Click below to visit the homepage.":"It seems like either your email verification token is wrong or it is expired click on the given link below to generate another verification link."}
          </div>
          <button onClick={() => isSuccess? navigate("/"):navigate("/EmailNotVerifiedYetForm")}>{isSuccess? "Back To Home":"Generate link again."}</button>
        </div>
      </div>
    </div>
  );
}

export default CheckVerifyEmailToken;
