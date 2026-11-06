import type React from "react";
import styles from "./SingleOrderDetailsPage.module.css";
import { useSearchParams } from "react-router-dom";
import SingleOrderDetailsPageHeader from "../../Components/MainWebsiteComponents/SingleOrderDetailsPageComponents/SingleOrderDetailsPageHeader";
import SingleOrderDetailsPageBody from "../../Components/MainWebsiteComponents/SingleOrderDetailsPageComponents/SingleOrderDetailsPageBody";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { useEffect, useState } from "react";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import { Toaster } from "sonner";
function SingleOrderDetailsPage():React.JSX.Element{
    const [searchParams]=useSearchParams();
    const [isLoading,setIsLoading]=useState<boolean>(false);
    const [isError,setIsError]=useState<boolean>(false);
    const orderId= Number(searchParams.get("orderId"));
    useEffect(() => {
          const handleOnline = () => {
            setIsError(false); 
          };
        
          window.addEventListener('online', handleOnline);
          
          return () => window.removeEventListener('online', handleOnline);
        }, []);

    return(
        <div className={styles.background}>
            <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
            <ErrorScreen1 isError={isError}></ErrorScreen1>
            <Toaster position="top-right"></Toaster>
            <div style={{
                display: (isError||isLoading)?"none":"flex"
            }} className={styles.maincontentbackground}>
                <SingleOrderDetailsPageHeader></SingleOrderDetailsPageHeader>
        <SingleOrderDetailsPageBody setIsError={setIsError} setIsLoading={setIsLoading} orderId={orderId}></SingleOrderDetailsPageBody>
            </div>
        
        </div>
    )

}
export default SingleOrderDetailsPage;