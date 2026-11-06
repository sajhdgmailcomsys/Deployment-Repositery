import type { ChangePassSchema } from "../../Schemas/AuthenticationSchemas/ChangePassSchema";
import { changePassSchema } from "../../Schemas/AuthenticationSchemas/ChangePassSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./ChangePasswordForm.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import messSentSymbol from "../../assets/MessageSent.svg";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { toast, Toaster } from "sonner";

type responseType = {
  success: boolean;
  message: string;
};

function ChangePasswordForm(): React.JSX.Element {
  const {
    register,
    clearErrors,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassSchema>({
    resolver: zodResolver(changePassSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const resendResetPasswordVerificationToken = async () => {
    try {
      const email = sessionStorage.getItem("userEmail");
      const response = await api.post<responseType>(
        "/api/Authentication/generatresetpasswordlink",
        { Email: email },
      );
      if (response.status == HttpStatusCode.Ok) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          toast.error(responseData.message);
        }
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsError(false);
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const onSubmit = async (data: ChangePassSchema): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<responseType>(
        "/api/Authentication/generatresetpasswordlink",
        { Email: data.email },
      );
      if (response.status == HttpStatusCode.Ok) {
        setIsSent(true);
        sessionStorage.setItem("userEmail", data.email);
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: responseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          setIsLoading(false);
          setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          setIsLoading(false);
          setError("email", { type: "server", message: responseData.message });
        }
      }
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow:"hidden"}}>
      <div
        style={{
          display: isSent ? "flex" : "none",
        }}
        className={styles.successbackground}
      >
        <div className={styles.successscreen}>
          <img src={messSentSymbol} alt="Succeeded" />
          <p className={styles.successtext}>
            We sent a verification link to your email address. Click the link to
            securely verify your identity and choose a new password. For
            security reasons the link may expire after a short period. Check
            your spam folder if you do not see it soon.{" "}
          </p>
          <p className={styles.loginlinktext}>
            Back to{" "}
            <Link to="/login" className={styles.loginlink}>
              Login?
            </Link>
          </p>
          <button
            onClick={resendResetPasswordVerificationToken}
            className={styles.btn155}
          >
            <span className={styles.buttonicon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentcolor"
                viewBox="0 0 24 24"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
            </span>
            <span className={styles.buttontext}>Resend Verification Link</span>
          </button>
        </div>
      </div>

      {isLoading && <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>}
      {isError && <ErrorScreen1 isError={isError}></ErrorScreen1>}
      <Toaster position="top-center"></Toaster>
      <div
        style={{
          display: (isSent||isLoading||isError) ? "none" : "flex",
        }}
        className={styles.background}
      >
        <div className={styles.changepassbackground}>
          <p className={styles.firtext}>Reset Your Password</p>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                {...register("email", { onChange: () => clearErrors("email") })}
              />
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
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

export default ChangePasswordForm;
