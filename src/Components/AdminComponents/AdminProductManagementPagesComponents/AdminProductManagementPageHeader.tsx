import type React from "react";
import styles from "./AdminProductManagementPageHeader.module.css";
import prePageImage from "../../../assets/PreviousPageIcon.svg";
import { useNavigate } from "react-router-dom";

function AdminAddProductPageHeader():React.JSX.Element{
    const navigate= useNavigate();
    const navigateBack=()=>{
        navigate(-1);
    }


    return(
        <div className={styles.header}>
            <div className={styles.prepagebutton}>
                <button onClick={navigateBack}><img src={prePageImage} alt="Previous page icon" /></button>
            </div>
            <div className={styles.headertext}>
                <p>Paradise Super Store</p>
            </div>
            
        </div>

    );

}
export default AdminAddProductPageHeader;