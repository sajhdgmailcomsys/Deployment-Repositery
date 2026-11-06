import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { type VerifyEmailSchema } from "../../Schemas/AuthenticationSchemas/VerifyEmailSchema";
import { verifyEmailSchema } from "../../Schemas/AuthenticationSchemas/VerifyEmailSchema";
import styles from "./EmailNotVerifiedYetForm.module.css";
import messSentSymbol from "../../assets/MessageSent.svg";
import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import axios, { HttpStatusCode } from "axios";
import api from "../../API/Axios";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import { toast, Toaster } from "sonner";

type responseType={
  success:boolean,
  message:string,
  data:object
}



function EmailNotVerifiedYetForm():React.JSX.Element{
  const {
    register,
    clearErrors,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });



  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsError(false); 
    };
  
    window.addEventListener('online', handleOnline);
    
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const resendVerificationEmail=async ()=>
{
  try{
    const email=sessionStorage.getItem('userEmail');
  const response=await api.post<responseType>("/api/Authentication/generateverifyemaillink",{Email:email});
  if(response.status==HttpStatusCode.Ok)
  {
    toast.success(response.data.message);
  }

  }catch(error)
  { 
    if(axios.isAxiosError(error))
    {
      const responseData=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message);
        }
    }
  }
  
}

  

  const onSubmit = async (data: VerifyEmailSchema): Promise<void> => {
    
    setIsLoading(true);
    try{
  const response=await api.post<responseType>("/api/Authentication/generateverifyemaillink",{Email:data.email});
  if(response.status==HttpStatusCode.Ok)
  {
    setIsSent(true);
    sessionStorage.setItem("userEmail",data.email);
    reset();
  }

  }catch(error)
  {
    if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
        setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          setIsLoading(false);
          setError("email",{type:"server",message:responseData.message})
        }
    }
  }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          opacity: isSent ? 1 : 0,
          position: "absolute",
          inset: 0,
          pointerEvents: isSent ? "auto" : "none",
          transition: "all 0.4s ease",
        }}
        className={styles.successbackground}
      >
        <div className={styles.successscreen}>
          <img src={messSentSymbol} alt="Succeeded" />
          <p className={styles.successtext}>
            We sent a verification link to your email address. Click the link to
            securely verify your identity and choose a new password. Check your
            spam folder if you do not see it soon.{" "}
          </p>
          <p className={styles.loginlinktext} >Back to{" "}<Link to="/login" className={styles.loginlink} >Login?</Link></p>
          <button onClick={resendVerificationEmail}  className={styles.btn155}>
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

      {isLoading?<LoadingScreen1 isLoading={isLoading}></LoadingScreen1>:""}
      {isError?<ErrorScreen1 isError={isError}></ErrorScreen1>:""}
      <Toaster position="top-center"></Toaster>
      <div
        style={{
          opacity: isLoading || isSent ? 0 : 1,
          inset: 0,
          transition: "all 0.4s ease",
          pointerEvents: isLoading || isSent ? "none" : "auto",
          transform: isLoading
            ? "perspective(500px) translateZ(-50px)"
            : "perspective(500px) translateZ(0)",
        }}
        className={styles.background}

      >
        <div className={styles.verifyemailcontainer}>
                  <p className={styles.firtext}>It seems that you Email has not been verified yet. Please provide us your email so we can send you a verification link.</p>

        <div className={styles.verifyemailbackground}>
          <p className={styles.sectext} >Verify Email</p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <button>Send Verification Link</button>
            <Link className={styles.signuplink} to="/signup">
              Sign up?
            </Link>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
export default EmailNotVerifiedYetForm;