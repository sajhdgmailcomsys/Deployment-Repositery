import type React from "react";
import styles from "./SetContactDetails.module.css";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  contactDetailSchema,
  type contactDetailSchemaType,
} from "../../Schemas/AuthenticationSchemas/SetContactDetailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";

type contactDetailsType={
  address:string,
  pakistaniPhoneNumber:string
}

type responseType={
  success:boolean,
  message:string,
  data:object
}
function SetContactDetails(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleOnline = () => {
      setIsError(false); 
    };
  
    window.addEventListener('online', handleOnline);
    
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<contactDetailSchemaType>({
    mode:"onBlur",
    resolver: zodResolver(contactDetailSchema),
    defaultValues: {
      address: "",
      pakistaniPhoneNumber: "",
    },
  });
  const handlePhoneNumberChange = (
    event: React.InputEvent<HTMLInputElement>,
  ) => {
    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
    setValue("pakistaniPhoneNumber", event.currentTarget.value);
  };

  const onSubmit = async (data: contactDetailSchemaType) => {
    const phoneNumber ="+92 "+ (data.pakistaniPhoneNumber.startsWith("0")
      ? data.pakistaniPhoneNumber.slice(1)
      : data.pakistaniPhoneNumber);
    const cleanedData:contactDetailsType = {
      address: data.address,
      pakistaniPhoneNumber: phoneNumber,
    };
    try{
      setIsLoading(true);
      const response = await api.post<responseType>("/api/Authentication/setcontactdetails",{
        UserContactNumber:cleanedData.pakistaniPhoneNumber,
        UserAddress:cleanedData.address
      });

      if(response.status===HttpStatusCode.Ok)
      {

        navigate("/cart",{replace:true});
        reset();
      }
    }
    catch(error){
      if (axios.isAxiosError(error)) {
        const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
        setIsError(true);
        } 
        if(error.status==HttpStatusCode.BadRequest)
        {
        
        if(responseData.message==="User not found.")
        {
          navigate("/signup");

        }
        else if(responseData.message==="Invalid user id")
        {
          navigate("/login");
        }else {
          setIsLoading(false);
          setError("pakistaniPhoneNumber",{
          type:'server',
          message:responseData.message
        })
          
        }
        
      }

        
      }

    }

  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {isLoading ? <LoadingScreen1 isLoading={isLoading}></LoadingScreen1> : ""}

      <div
        style={{
          opacity: isLoading || isError ? 0 : 1,
          inset: 0,
          transition: "all 0.4s ease",
          pointerEvents: isLoading || isError ? "none" : "auto",
          transform: isLoading
            ? "perspective(500px) translateZ(-50px)"
            : "perspective(500px) translateZ(0)",
        }}
        className={styles.background}
      >
        <div className={styles.formcontainer}>
          <h1>Contact Information</h1>
          <p className={styles.subheading}>
            Please fill out your verified details below.
          </p>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`${styles.inputGroup} ${errors.address ? styles.hasError : ""}`}
              id={styles.addressBox}
            >
              <label htmlFor="email" className={styles.label}>
                Address:
              </label>
              <textarea
                rows={5}
                
                
                placeholder="Enter your complete address."
                id="address"
                className={styles.textarea}
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className={styles.error}>{errors.address.message}</p>
            )}
            <div
              className={`${styles.inputGroup} ${styles.phoneGroup} ${errors.pakistaniPhoneNumber ? styles.hasError : ""}`}
            >
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number:
              </label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.countryCode}>+92 </span>
                <input
                  type="tel"
                  maxLength={11}
                  inputMode="numeric"
                  onInput={handlePhoneNumberChange}
                  placeholder="XXXXXXXXXX"
                  id="phoneNumber"
                  className={styles.inputReset}
                  {...register("pakistaniPhoneNumber")}
                />
              </div>
            </div>
            {errors.pakistaniPhoneNumber && (
              <p className={styles.error}>
                {errors.pakistaniPhoneNumber.message}
              </p>
            )}

            <button className={styles.senddetailsbutton} type="submit">
              Send Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SetContactDetails;

