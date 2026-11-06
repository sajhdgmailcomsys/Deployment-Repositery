import type React from "react";
import styles from "./SearchResultHeader.module.css";
import previousIcon from "../../../assets/PreviousPageIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import { useNavigate } from "react-router-dom";

function SearchResultHeader({previousSearch}:{previousSearch:string}):React.JSX.Element{
    const navigate = useNavigate();

    const navigateToSearchPage = (
        
      ): void => {
        
          navigate(`/searchpage?previousSearch=${previousSearch}`);
        
      };
      const navigateToPreviousPage=()=>{
        navigate(-1);
      }

    return(
        <div className={styles.header}>
            <button className={styles.previouspagebutton} onClick={navigateToPreviousPage}><img src={previousIcon} alt="Previous page." /></button>
          
          <div>
            <img src={searchIcon} alt="Search page" />
            <input
              type="text"
              value={previousSearch}
              onMouseDown={navigateToSearchPage}
              inputMode="none"
              
            />
          </div>
        </div>

    )
}
export default SearchResultHeader;