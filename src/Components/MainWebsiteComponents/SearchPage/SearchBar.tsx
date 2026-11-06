import type React from "react";
import styles from "./SearchBar.module.css";
import searchIcon from "../../../assets/SearchIcon.svg";
import type { ChangeEvent } from "react";
import { saveSearchHistoryInLocalStorage } from "../../../HelperFunctions/LocalStorageFunctions";
import { useNavigate } from "react-router-dom";
interface propsType{
    searchValue:string;
    setSearchValue:(value:string)=>void
}
function SearchBar(props:propsType):React.JSX.Element{
  const navigate=useNavigate();

      const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.currentTarget.value;
        props.setSearchValue(value);
      };
      const handleEnterClick=(event:React.KeyboardEvent<HTMLInputElement>)=>{
        if(event.key==="Enter"){
          const value = event.currentTarget.value;
          saveSearchHistoryInLocalStorage(value);
          navigate(`/searchresult?search=${props.searchValue}`);
        }

      }

    return(

        <div className={styles.searchContainer}>
      <div className={styles.searchbar}>
        <img 
          src={searchIcon} 
          alt="" 
          aria-hidden="true" 
          className={styles.searchIcon} 
        />
        <input 
          type="text" 
          onKeyDown={handleEnterClick}
          value={props.searchValue} 
          onChange={handleSearchChange} 
          placeholder="Search documentation, guides..." 
          className={styles.searchInput}
          aria-label="Search content site wide"
        />
        
      </div>
    </div>

    )
}
export default SearchBar;