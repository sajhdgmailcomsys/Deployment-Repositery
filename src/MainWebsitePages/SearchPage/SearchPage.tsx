import type React from "react";
import styles from "./SearchPage.module.css";
import { useEffect, useState  } from "react";
import SearchBar from "../../Components/MainWebsiteComponents/SearchPage/SearchBar";
import SearchHistory from "../../Components/MainWebsiteComponents/SearchPage/SearchHistory";
import SearchRecommendations from "../../Components/MainWebsiteComponents/SearchPage/SearchRecommendations";
import { useSearchParams } from "react-router-dom";

function SearchPage(): React.JSX.Element {
  const [searchValue, setSearchValue] = useState<string>("");
  const [matchedResults, setMatchedResults] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const previousSearch = searchParams.get('previousSearch');
  useEffect(()=>{
    setTimeout(()=>setSearchValue(previousSearch||""),0)
  },[]);


  return (
    <div className={styles.background}>
      <div className={styles.searchpage}>
        <SearchBar searchValue={searchValue} 
        setSearchValue={setSearchValue}
        ></SearchBar>
        <SearchHistory setMatchedResults={setMatchedResults}
        setSearchValue={setSearchValue}

        ></SearchHistory>

        <SearchRecommendations setMatchedResults={setMatchedResults}
        setSearchValue={setSearchValue}
        matchedResults={matchedResults}
        searchValue={searchValue}
        ></SearchRecommendations>
      </div>
    </div>
  );
}

export default SearchPage;
