import type React from "react";
import styles from "./OrderHistory.module.css";
import { useEffect, useState } from "react";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import OrderHistoryHeader from "../../Components/MainWebsiteComponents/OrderHistory/OrderHistoryHeader";
import OrderHistoryContainer from "../../Components/MainWebsiteComponents/OrderHistory/OrderHistoryContainer";

function OrderHistory(): React.JSX.Element {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
      const handleOnline = () => {
        setIsError(false); 
      };
    
      window.addEventListener('online', handleOnline);
      
      return () => window.removeEventListener('online', handleOnline);
    }, []);
  
 

 

  return (
    <div style={{ width: "100vw", height: "100vh",overflow:"hidden"}}>
      <ErrorScreen1 isError={isError}></ErrorScreen1>

      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>

      <div
        style={{
          display:isError||isLoading?"none":"flex",
        }}
        className={styles.background}
      >
        <OrderHistoryHeader></OrderHistoryHeader>
        <OrderHistoryContainer setIsError={setIsError} setIsLoading={setIsLoading}></OrderHistoryContainer>
        
      </div>
    </div>
  );
}

export default OrderHistory;
