import { signupSchema } from "../../Schemas/AuthenticationSchemas/SignupSchema";
import type { SubmitHandler } from "react-hook-form";
import type { signupschema } from "../../Schemas/AuthenticationSchemas/SignupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import closedEye from "../../assets/Closedeye.png";
import openEye from "../../assets/Openeye.png";
import styles from "./Signup.module.css";
import messSentSymbol from "../../assets/MessageSent.svg";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import { toast, Toaster } from "sonner";

type responseType={
  success:boolean,
  message:string,
  data:object
}

function Signup(): React.JSX.Element {
  const {
    register,
    clearErrors,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<signupschema>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode:"onBlur",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSent,setIsSent]=useState<boolean>(false);
  const navigate = useNavigate();

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
  const onSubmit:SubmitHandler<signupschema> = async (data:signupschema) => { 
    setIsLoading(true);
    try{
      const response=await api.post<responseType>("/api/Authentication/signup",
      {
        Email:data.email,
        Password:data.password
      }
    );
    if(response.status==HttpStatusCode.Ok)
    {
      setIsLoading(false);
    setIsSent(true);
    localStorage.setItem("hasUserSignedUp",JSON.stringify(true));
    sessionStorage.setItem('userEmail', data.email);
    reset();
    }
    }catch(error){
      setIsLoading(false);
      

      if (axios.isAxiosError(error)) {
        const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        setIsError(true);
        } 
        if(error.status==HttpStatusCode.BadRequest)
        {
        setIsLoading(false);
        if(responseData.message==="User Already exist.")
        {
          setError("email",{
          type:'server',
          message:"User already exists."
        })
        }
        else if(responseData.message==="Please verify your email."){
          navigate("/EmailNotVerifiedYetForm");
          
        }
        
      }

        
      }
    }
  };

  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);

  return (
    <div style={{ width: "100vw", height: "100vh",position:"relative" }}>
    <Toaster position="top-center"></Toaster>

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
            Before you sign up we need to verify your email.
            We sent a verification link to your email address. Click the link to
            securely verify your identity. For security reasons the link may expire after a short period. Check your
            spam folder if you do not see it soon.{" "}
          </p>
          <p className={styles.loginlinktext} >Back to{" "}<Link to="/login" className={styles.loginlink} >Login?</Link></p>
          <button onClick={resendVerificationEmail} className={styles.btn155}>
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
      {isError?<ErrorScreen1 isError={isError} message="It seems like you are currently offline."></ErrorScreen1>:""}
      {isLoading?<LoadingScreen1 isLoading={isLoading}></LoadingScreen1>:""}

      <div
        style={{
          opacity: isLoading||isSent ? 0 : 1,
          inset: 0,
          transition: "all 0.4s ease",
          pointerEvents: isLoading||isSent ? "none" : "auto",
          transform: isLoading ? 'perspective(500px) translateZ(-50px)' : 'perspective(500px) translateZ(0)'
        }}
        className={styles.background}
      >
        <div className={styles.psslogo}>
          <img src="" alt="" />
        </div>
        <div className={styles.signupbackground}>
          <div className={styles.signupscreen}>
            <p className={styles.firtext}>Sign up</p>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div
                style={{
                  border: `1px solid ${errors.email?.message ? "red" : "black"}`,
                }}
                id={styles.emailbox}
              >
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                   id="email"
                  {...register("email", {
                    onChange: () => clearErrors("email"),
                  })}
                />
              </div>
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
              <div
                style={{
                  border: `1px solid ${errors.password?.message ? "red" : "black"}`,
                }}
              >
                <label htmlFor="password">Password:</label>
                <input
                autoComplete="new-password"
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
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
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
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
              <button className={styles.signupbutton} type="submit">
                Sign up
              </button>
            </form>
            <p className={styles.alternativemethod}>
              Already have an account?{" "}
              <Link  onMouseDown={(e)=> {e.preventDefault();}}   className={styles.loginlink} to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
