import type React from "react";
import styles from "./ProductPage.module.css";
import { useEffect, useState } from "react";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import QuantityInputBox from "../../Components/MainWebsiteComponents/ProductPage/QuantityInputBox";
import ProductPageHeader from "../../Components/MainWebsiteComponents/ProductPage/ProductPageHeader";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import { toast, Toaster } from "sonner";
import { useSearchParams } from "react-router-dom";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
type productDetailsType={
  description:string,
  price:number,
  imageURLs:string[],
  detailedDescription:string,
  stock:number
  unit:string
}
type productDetailsResponseType={
  successs:boolean,
  message:string,
  data:productDetailsType
}
type responseType={
  success:boolean,
  message:string,
  data:string
}

function ProductPage(): React.JSX.Element {
  const [searchParams]=useSearchParams();

  const productId= searchParams.get("productId");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("1");
  const [productDetails,setProductDetails]=useState<productDetailsType>();

  useEffect(() => {
      const handleOnline = () => {
        setIsError(false); 
      };
    
      window.addEventListener('online', handleOnline);
      
      return () => window.removeEventListener('online', handleOnline);
    }, []);
  const addToCart=async()=>{
    if(quantity==="")
    {
      toast("Please select the amount you want to add in your cart.",{duration:1000});
      return;
    }
    if(productDetails?.stock===0)
    {
      toast("Sorry the item is out of stock..",{duration:1000});
      return;
    }
    try{
      setIsLoading(true);
  const response=await api.post<responseType>("/api/Cart/incrementcartitemquantity",{
  productId: Number(productId),
  quantity: Number(quantity)
});
  if(response.status==HttpStatusCode.Ok)
  {
    setIsLoading(false);
    toast.success("Product successfully added to cart.")
    
  }

  }catch(error)
  {
    if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
        setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          setIsLoading(false);
          toast.error(responseData.message);
        }
    }
  }
  }
  
  useEffect(()=>{
    const getProductDetails=async()=>{

    try{
      setIsLoading(true);
  const response=await api.get<productDetailsResponseType>(`/api/Product/getsingleproductdetails/${Number(productId)}`);
  if(response.status==HttpStatusCode.Ok)
  {
    setIsLoading(false);
    setProductDetails(response.data.data);
    
  }

  }catch(error)
  {
    if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
        setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          setIsLoading(false);
          toast.error(responseData.message);
        }
    }
  }
  };
  getProductDetails();

  },[]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
      <ErrorScreen1 isError={isError}></ErrorScreen1>
      <Toaster position="top-center" closeButton={true} />
      
      

      <div
        style={{
          display: isLoading || isError ? "none" : "block",
        }}
        className={styles.background}
      >
       
          <ProductPageHeader></ProductPageHeader>
          <div className={styles.gridcontainer}>
            <div className={styles.gridimages}>
              <div className={styles.slidercontainer}>
                  {productDetails?.imageURLs.map((imageUrl,index)=>(
                    <div key={index} className={styles.slide}>
                    <img src={imageUrl} alt="Slide 1" />
                  </div>
                  ))}
              </div>
            </div>
            <div className={styles.griddetails}>
              <p className={styles.productdiscription}>
                {productDetails?.description}
              </p>
              <p className={styles.price}>{`PKR ${productDetails?.price}`}</p>
              <QuantityInputBox quantity={quantity}
              setQuantity={setQuantity}
              stock={productDetails?.stock??0}
              unit={productDetails?.unit??"Items"}

              ></QuantityInputBox>
              <p className={styles.detaileddescription}>
                {productDetails?.detailedDescription}
                
              </p>
              <div className={styles.addtocart}>
                <button onClick={addToCart}>Add To Cart</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default ProductPage;
