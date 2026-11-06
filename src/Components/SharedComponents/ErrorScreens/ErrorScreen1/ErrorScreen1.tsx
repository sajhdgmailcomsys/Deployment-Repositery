import type React from "react";
import styles from "./ErrorScreen1.module.css";

interface propsType{
    isError:boolean;
    message?:string;
}
function ErrorScreen1(props:propsType):React.JSX.Element{
  const reloadPage=()=>{
    window.location.reload();
  }
    return(
        <div
        data-active={props.isError}
        className={styles.errorbackground}
      >
        <div className={styles.errorscreen}>
          <h1>Error </h1>
          <p>
            {props.message||"It seems like an error occurred while trying to process your request."}
          </p>
          <button onClick={reloadPage} className={styles.tryagainbutton}>Try Aain</button>
        </div>
      </div>
    );
}
export default ErrorScreen1;