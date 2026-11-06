import type React from "react";
import styles from "./CartHeader.module.css";
import previousIcon from "../../../assets/PreviousPageIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import { useNavigate } from "react-router-dom";
function CartHeader():React.JSX.Element{
    const navigate= useNavigate();
    const navigateToPreviousPage= ()=>{
        navigate(-1);

    }
    const navigateToSearchPage=()=>{
        navigate("/searchpage");
    }

    return(
        <div className={styles.header}>
          <button onClick={navigateToPreviousPage}>
            <img src={previousIcon} alt="Previous page" />
          </button>

          <div>
            <p>Your Cart</p>
          </div>
          <button onClick={navigateToSearchPage}>
            <img src={searchIcon} alt="Search icon" />
          </button>
        </div>

    )
}
export default CartHeader;