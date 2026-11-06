import type React from "react";
import styles from "./LoadingScreen1.module.css";
import { Mosaic } from "react-loading-indicators";
interface propsType{
    isLoading:boolean;
    message?:string;
}
function LoadingScreen1(props:propsType):React.JSX.Element{
    return(
        <div
        data-active={props.isLoading}

        className={styles.loadingscreen}
        
      >
        <Mosaic color="#32cd32" size="medium" text="" textColor="" />
        <p>{props.message??"Processing your request..."}</p>
      </div>
    )
}
export default LoadingScreen1;