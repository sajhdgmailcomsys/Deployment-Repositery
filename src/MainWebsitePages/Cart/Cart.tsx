import styles from "./Cart.module.css";
import { Toaster } from "sonner";
import PaymentMethodContainer from "../../Components/MainWebsiteComponents/Cart/PaymentMethodContainer";
import { useEffect, useState } from "react";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import CartHeader from "../../Components/MainWebsiteComponents/Cart/CartHeader";
import CartPriceContainer from "../../Components/MainWebsiteComponents/Cart/CartPriceContainer";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import CartItemsContainer from "../../Components/MainWebsiteComponents/Cart/CartItemsContainer";

type cartItemType={
  cartItemId:number,
  productId:number,
  description:string,
  imageURL:string,
  quantity:number,
  productUnitPrice:number,
  subTotal:number,
  stock:number,
  unit:string
}
type cartItemsResponseType={
  success:boolean,
  message:string,
  data:cartItemType[]
}

function Cart() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMethodId, setSelectedMethodId] = useState<number>(1);
  const [cartItemsData,setCartItemsData]=useState<cartItemType[]>([]);

  useEffect(() => {
      const handleOnline = () => {
        setIsError(false); 
      };
    
      window.addEventListener('online', handleOnline);
      
      return () => window.removeEventListener('online', handleOnline);
    }, []);
  

  
  useEffect(()=>{
    const getCartItems=async()=>{
    try{
      setIsLoading(true);
      const response=await api.get<cartItemsResponseType>(`/api/Cart/getcartitems`);
    if(response.status==HttpStatusCode.Ok)
      {
        setIsLoading(false);
        setCartItemsData(response.data.data);
      }

    }catch(error){

      if(axios.isAxiosError(error))
    {
        if (error.code === 'ERR_NETWORK') {
          setIsLoading(false);
          setIsError(true);
        } 
        
    }

    }

  };
  getCartItems();

  },[])

  

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ErrorScreen1 isError={isError} ></ErrorScreen1>
       <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
       <Toaster position="top-center" closeButton={true} />

      <div
        style={{
          
            display: isLoading|| isError?"none":"block",
        }}
        className={styles.background}
      >
        <CartHeader></CartHeader>
        
        <div className={styles.maincontent}>
          <CartItemsContainer setIsError={setIsError} setIsLoading={setIsLoading} setCartItemsData={setCartItemsData} cartItemsData={cartItemsData} ></CartItemsContainer>

          <div className={styles.maincontainer}>
            <PaymentMethodContainer
              selectedMethodId={selectedMethodId}
              setIsError={setIsError}
              setSelectedMethodId={setSelectedMethodId}
            ></PaymentMethodContainer>
          </div>

          <CartPriceContainer setIsLoading={setIsLoading} setCartItemsData={setCartItemsData} setIsError={setIsError} selectedPaymentMethodId={selectedMethodId}></CartPriceContainer>
        </div>
      </div>
    </div>
  );
}
export default Cart;
