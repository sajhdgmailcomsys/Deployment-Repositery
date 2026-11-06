import type React from "react";
import styles from "./OrderHistoryHeader.module.css";
import previousIcon from "../../../assets/PreviousPageIcon.svg";
import { useNavigate } from "react-router-dom";
function OrderHistoryHeader():React.JSX.Element{
    const navigate=useNavigate();
    const navigateToPreviousPage=()=>{
        navigate(-1);
    }
    return(
        <div className={styles.header}>
            <button onClick={navigateToPreviousPage}>
                <img src={previousIcon} alt="" />
            </button>
          
          <p>Order Hidtory</p>
          
        </div>
    )
}
export default OrderHistoryHeader;