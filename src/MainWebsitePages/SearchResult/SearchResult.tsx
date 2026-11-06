import type React from "react";
import styles from "./SearchResult.module.css";
import { useEffect, useState } from "react";
import ProductCard from "../../Components/MainWebsiteComponents/Home/ProductCard";
import { Toaster } from "sonner";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import SearchResultHeader from "../../Components/MainWebsiteComponents/SearchResult/SearchResultHeader";
import { useSearchParams } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import api from "../../API/Axios";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";

type searchResultProductType={
  productId:number,
  description:string,
  price:number,
  imageURL:string,
  stock:number
  unit:string
}

type responseType=searchResultProductType[];


function SearchResult(): React.JSX.Element {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResultProductsData,setSearchResultProductsData]=useState<searchResultProductType[]>([]);
  const [page,setPage]=useState<number>(1);
  const pageSize:number=2;
  const [searchParams]=useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
        const handleOnline = () => {
          setIsError(false); 
        };
      
        window.addEventListener('online', handleOnline);
        
        return () => window.removeEventListener('online', handleOnline);
      }, []);
  useEffect(()=>{
    setTimeout(()=>{
      setSearchValue(search||"");

    },0)

  },[search]);
  
  useEffect(()=>{
    const getProductsUsingSearch=async()=>{
    try{
      setIsLoading(true);
  const response=await api.get<responseType>(`/api/Product/getproductssearchresult/${search}/${page}/${pageSize}`);
  if(response.status==HttpStatusCode.Ok)
  {
    setIsLoading(false);
    setSearchResultProductsData(prevProducts=>[...prevProducts,...response.data]);
  }

  }catch(error)
  {
    if(axios.isAxiosError(error))
    {

        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
        setIsError(true);
        } 
        
    }
  }

  };
  getProductsUsingSearch();

  },[search,page]);

  const handleScrollOnProductsContainer=(event:React.MouseEvent<HTMLDivElement>)=>{
      const target= event.currentTarget;
      const scrollHeight=target.scrollHeight;
      const scrollTop=target.scrollTop;
      const clientHeight=target.clientHeight;
      const threshold=4;
      const isAtBottom=scrollHeight-scrollTop-clientHeight <=threshold;
      if(isAtBottom){
        setPage(prevValue=>prevValue+1);
      }
  
    }
  

  

  

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
      <ErrorScreen1 isError={isError}></ErrorScreen1>

      
      <div
        style={{
          display:isLoading||isError?"none":"flex"
        }}
        className={styles.background}
      >
        <SearchResultHeader previousSearch={searchValue}></SearchResultHeader>
        <Toaster position="top-center" closeButton={true} />
        <div onScroll={handleScrollOnProductsContainer} className={styles.searchresultcontainer}>
          
          {searchResultProductsData &&
            searchResultProductsData.map((product) => (
              <ProductCard
              unit={product.unit}

              
              setIsError={setIsError}
                price={product.price}
                productId={product.productId}
                imageURL={product.imageURL}
                description={product.description}
                stock={product.stock}
              ></ProductCard>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
