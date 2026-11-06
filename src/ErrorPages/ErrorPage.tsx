import type React from "react";
import styles from "./ErrorPage.module.css";
import { useSearchParams } from "react-router-dom";
import previousIcon from "../assets/PreviousPageIcon.svg";

function ErrorPage():React.JSX.Element{
    
    const [searchParams]=useSearchParams();
    const errorCode=searchParams.get("errorCode")||500;
    const message=searchParams.get("message")|| "Something went wrong."

    return(
        <div className={styles.background}>
            <div className={styles.header}> <img src={previousIcon} alt="" />  </div>
            <div className={styles.content}>
            <div className={styles.errorscreen}>
                <h1 >Error {errorCode}</h1>
                <p>
                    {message} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste, dolorem fugia
                    t! Dolorem hic corporis neque doloremque de

                </p>
            </div>
            </div>
        </div>




    );

}
export default ErrorPage;