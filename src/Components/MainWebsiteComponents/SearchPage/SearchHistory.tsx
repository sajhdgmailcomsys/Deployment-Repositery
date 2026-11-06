import type React from "react";
import styles from "./SearchHistory.module.css";
import { useNavigate } from "react-router-dom";
interface propsType {
  setSearchValue: (value: string) => void;
  setMatchedResults: (value: string[]) => void;
}
function SearchHistory(props: propsType): React.JSX.Element {
  const storageKey = import.meta.env.VITE_LocalStorage_Search_History_Name;
  const searchHistory = localStorage.getItem(storageKey);
  const navigate = useNavigate();
  const handleSelectResult = (event: React.MouseEvent<HTMLButtonElement>) => {
    const result = event.currentTarget.value;
    event.preventDefault();
    props.setSearchValue(result);
    props.setMatchedResults([]);
    navigate(`/searchresult?search=${result}`);
  };

  return (
    <div className={styles.searchhistory}>
      {searchHistory &&
        JSON.parse(searchHistory).map((search: string, index: number) => (
          <button
            key={index}
            value={search}
            className={styles.singlehistorysearch}
            onClick={handleSelectResult}
          >
            <p className={styles.text}>{search}</p>
          </button>
        ))}
    </div>
  );
}
export default SearchHistory;
