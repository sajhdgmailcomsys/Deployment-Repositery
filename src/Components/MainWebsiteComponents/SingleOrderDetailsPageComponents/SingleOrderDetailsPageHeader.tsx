import type React from "react";
import styles from "./SingleOrderDetailsPageHeader.module.css";
import previousPageIcon from "../../../assets/PreviousPageIcon.svg";
import { useNavigate } from "react-router-dom";
function SingleOrderDetailsPageHeader():React.JSX.Element{
    const navigate= useNavigate();
    const navigateToPreviousPage=()=>{
        navigate(-1);
    }

    return(
        <div className={styles.header}>
            <div className={styles.previouspagebutton}><button onClick={navigateToPreviousPage}><img src={previousPageIcon} /></button></div>
            <div>Order Details</div>

        </div>
    )
}
export default SingleOrderDetailsPageHeader;