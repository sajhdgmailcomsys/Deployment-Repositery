import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Sidebar from "../../Components/MainWebsiteComponents/Home/SideBarComponent";
import ProductCard from "../../Components/MainWebsiteComponents/Home/ProductCard";
import { Toaster } from "sonner";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import HomeHeader from "../../Components/MainWebsiteComponents/Home/HomeHeader";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

type homeProductType={
  productId:number,
  description:string,
  price:number,
  imageURL:string,
  stock:number,
  unit:string

}

type responseType={
  success:boolean,
  message:string,
  data:homeProductType[]
}

function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [homeProductsData,setHomeProductsData]=useState<homeProductType[]>([]);
  const [page,setPage]=useState<number>(1);
  const pageSize:number=30;
  const navigate= useNavigate();
  useEffect(() => {
      const handleOnline = () => {
        setIsError(false); 
      };
    
      window.addEventListener('online', handleOnline);
      
      return () => window.removeEventListener('online', handleOnline);
    }, []);


    useEffect(()=>{
      
    },[]);
    
    
  
  useEffect(()=>{
    const isUserSignedUp:boolean= JSON.parse(localStorage.getItem("hasUserSignedUp")??"false");
      if(isUserSignedUp===false)
      {
        navigate("/signup");
        return;
      }
    const getProductsForHome=async ()=>{
    try{
      setIsLoading(true);
  const response=await api.get<responseType>(`/api/Product/gethomeproducts/${page}/${pageSize}`);
  if(response.status==HttpStatusCode.Ok)
  {
    setHomeProductsData(prevProducts=>[...prevProducts,...response.data.data])
    setIsLoading(false);
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
    
  getProductsForHome();
  
  },[page]);

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
    <div style={{ width: "100vw", height: "100vh", position: "relative",overflow:"hidden" }}>
      <ErrorScreen1 isError={isError}></ErrorScreen1>

      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
      <Toaster position="top-center" closeButton={true} />

      <div
        style={{
          display: isLoading || isError ? "none" : "flex",
        
        }}
        className={styles.background}
      >
        <HomeHeader
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        ></HomeHeader>
        
        <div className={styles.maincontent}>

          <Sidebar
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
          ></Sidebar>

          <div onScroll={handleScrollOnProductsContainer} className={styles.gridcontainer}>
            {homeProductsData &&
              homeProductsData.map((product) => (
                <ProductCard
                unit={product.unit}
                key={product.productId}
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
    </div>
  );
}

export default Home;
