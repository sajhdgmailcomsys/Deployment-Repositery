import type React from "react";
import styles from "./CartPriceContainer.module.css";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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

interface propsType {
  selectedPaymentMethodId: number;
  setIsError:(value:boolean)=>void,
  setIsLoading:(value:boolean)=>void,
  setCartItemsData:(value:cartItemType[])=>void;   
}
type checkoutSummaryResponseData={
  deliverCharges:number,
  totalBill:number

}
type checkoutSummaryResponseType = {
  success: boolean;
  message: string;
 data:checkoutSummaryResponseData
};
type responseType = {
  success: boolean;
  message: string;
 data:string;
};
function CartPriceContainer(props: propsType): React.JSX.Element {

  const navigate= useNavigate();
  const [checkoutSummaryData,setCheckoutSummaryData]=useState<checkoutSummaryResponseData>();
  const placeOrder = async () => {
    try {
      props.setIsLoading(true);
      const response=await api.post<responseType>("/api/Cart/placeuserorder", {
        paymentMethodId: props.selectedPaymentMethodId,
      });
      if(response.status==HttpStatusCode.Ok)
        {
          props.setCartItemsData([]);
          props.setIsLoading(false);
          toast.success(response.data.message);
        }

    } catch(error) {
      if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
          props.setIsLoading(false);
        props.setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          if(responseData.message==="Please provide your contact details in order to place your order.")
          {
            props.setIsLoading(false);
            navigate("/Setcontactdetails");
          }else{
            props.setIsLoading(false);
            toast.error(responseData.message,{
              duration:5000
            });
          }
        }
    }
    }
  };
 const resetCart=async()=>{

  try{
      const response=await api.delete<responseType>("/api/Cart/resetusercart");
    if(response.status==HttpStatusCode.Ok)
      {
        toast.success(response.data.message);
        props.setCartItemsData([]);
        
      }

    }catch(error){

      if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        props.setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message,{
              duration:5000
            });
          
        }
    }

    }


 }
  

  useEffect(()=>{
    const getCheckoutSummary=async()=>{
    try{
      const response=await api.post<checkoutSummaryResponseType>("/api/Cart/checkoutsummary",{
    "paymentMethodId": props.selectedPaymentMethodId
    });
    if(response.status==HttpStatusCode.Ok)
      {
        setCheckoutSummaryData(response.data.data)
      }

    }catch(error){

      if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        props.setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message,{
              duration:5000
            });
          
        }
    }

    }
  }
  getCheckoutSummary();
    

  },[props]);

  return (
    <div className={styles.pricecontainer}>
      <div>
        <p>
          <span>Delivery Charges:</span>
          <strong>{`PKR ${checkoutSummaryData?.deliverCharges}`}</strong>
        </p>
        <p>
          <span>Total Bill:</span>
          <strong>{`PKR ${checkoutSummaryData?.totalBill}`}</strong>
        </p>
      </div>

      <div>
        <button onClick={placeOrder}>Place Order</button>
        <button onClick={resetCart}>Reset Cart</button>
      </div>
    </div>
  );
}
export default CartPriceContainer;
