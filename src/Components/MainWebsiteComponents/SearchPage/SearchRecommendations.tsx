import type React from "react";
import styles from "./SearchRecommendations.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
interface propsType{
    setSearchValue:(value:string)=>void;
    setMatchedResults:(list:string[])=>void;
    matchedResults:string[]
    searchValue:string
}
type responseType= string[];
function SearchRecommendations(props:propsType): React.JSX.Element {
    const navigate= useNavigate();
    const handleSelectResult = (event:React.MouseEvent<HTMLButtonElement>) => {
        const result=event.currentTarget.value;
        event.preventDefault();
    props.setSearchValue(result);
    props.setMatchedResults([]);
    navigate(`/searchresult?search=${result}`)
  };
  

  useEffect(()=>{
    const getSearchSuggestions=async()=>{
      if(props.searchValue==="")
      {
        props.setMatchedResults([]);
      }
    try{
  const response=await api.get<responseType>(`/api/Search/getsearchsuggestions/${props.searchValue}/10`);
  if(response.status==HttpStatusCode.Ok)
  {
    props.setMatchedResults(response.data);
  }

  }catch(error)
  {
    if(axios.isAxiosError(error))
    {
      return;
    }
  }

  };
  getSearchSuggestions();

  },[props.searchValue]);
  return (
    <div className={styles.customdropdowncontainer}>
      {props.matchedResults.length > 0 &&
        props.matchedResults.map((sentence: string, index: number) => (
            <div>
          <button
           key={index}
           value={sentence}
              className={styles.customdropdownitem}
              onClick={handleSelectResult}>
            <p
              
            >
              {sentence}
            </p>
            
          </button>
          <hr />
          </div>
        ))}
        
    </div>
  );
}
export default SearchRecommendations;
