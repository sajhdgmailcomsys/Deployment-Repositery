import type React from "react";
import styles from "./HomeHeader.module.css";
import searchIcon from "../../../assets/SearchIcon.svg";
import cartIcon from "../../../assets/CartIcon.svg";
import sideBarMainIcon from "../../../assets/SideBarMainIcon.png";
import { useNavigate } from "react-router-dom";

interface propsType{
    isExpanded:boolean;
    setIsExpanded:(value:boolean)=>void
}
function HomeHeader(props:propsType):React.JSX.Element{
    const navigate = useNavigate();
    const toggleSidebar = () => {
    props.setIsExpanded(!props.isExpanded);
  };

  const navigateToSearchPage=()=>{
        navigate("/searchpage");
  
      }  
      const navigateToCart=()=>{
        navigate("/cart");
      }
    return(
        <div className={styles.header}>
          <div><button  onMouseDown={toggleSidebar} className={`global-toggle-btn ${styles.togglebutton} ${props.isExpanded? styles.secondmodebutton:styles.firstmodebutton}`}>
        <img src={sideBarMainIcon} alt="Sidebar button." /> 
      </button></div>
          <div>
            <p>Paradise Super Store</p>
          </div>
          <button onClick={navigateToSearchPage}>
            <img src={searchIcon} alt="Search page." />
          </button>
          <button onClick={navigateToCart}>
            <img src={cartIcon} alt="Open Cart." />
          </button>
        </div>
    )
}
export default HomeHeader;