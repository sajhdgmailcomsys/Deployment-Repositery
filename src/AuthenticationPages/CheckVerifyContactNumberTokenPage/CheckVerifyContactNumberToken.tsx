/*import styles from "./CheckVerifyContactNumberToken.module.css";
import React, { useState } from "react";
//import { useSearchParams } from "react-router-dom";
import tickMark from "../../assets/TickMark.svg";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { useNavigate } from "react-router-dom";

function CheckVerifyContactNumberToken(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate=useNavigate();

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

      <div
        style={{
          display: isLoading ? "none" : "flex",
        }}
        className={styles.background}
      >
        <div className={styles.successScreen}>
          <div className={styles.iconWrapper}>
            <img src={tickMark} alt="Verification Successful" />
          </div>
          <h2 className={styles.title}>Verification Successful!</h2>
          <p className={styles.description}>
            Your contact number has been verified successfully! You can now
            place orders and enjoy shopping on this platform. Click the button
            given below in order to visit your cart.
          </p>
          <button onClick={()=>navigate("/cart")} className={styles.actionButton}>Visit The Cart</button>
        </div>
      </div>
    </div>
  );
}

export default CheckVerifyContactNumberToken;
*/