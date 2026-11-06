import type React from "react";
import styles from "./ProductPageHeader.module.css";
import previousPageIcon from "../../../assets/PreviousPageIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import cartIcon from "../../../assets/CartIcon.svg";
import { useNavigate } from "react-router-dom";
function ProductPageHeader():React.JSX.Element{
    const naviate= useNavigate();
    const navigateToPreviousPage=()=>{
        naviate(-1);
    }
    const navigateToSearchPage=()=>{
        naviate("/searchpage");
    }
    const navigateToCart=()=>{
        naviate("/cart");
    }
    return(
        <div className={styles.header}>
            <button onClick={navigateToPreviousPage}>
              <img src={previousPageIcon} alt="" />
            </button>
            <button onClick={navigateToSearchPage}>
              <img src={searchIcon} alt="" />
            </button>
            <button onClick={navigateToCart}>
              <img src={cartIcon} alt="" />
            </button>
          </div>
    )
}
export default ProductPageHeader;