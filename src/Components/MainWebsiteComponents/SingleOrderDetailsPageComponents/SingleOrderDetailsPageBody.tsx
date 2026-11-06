import type React from "react";
import styles from "./SingleOrderDetailsPageBody.module.css";
import { useEffect, useState } from "react";
import SingleOrderDetailsPageOrderItemsContainer from "./SingleOrderDetailsPageOrderItemsContainer";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
type orderItemType={
    description:string,
    imageURL:string,
    quantity:number
    subTotal:number
    unitPrice:number,
   
}
type orderType={
    orderId:number,
    orderStatus:string,
    createdAt:string,
    paidAt:string,
    paymentMethodName:string,
    paymentMethodCharges:number,
    deliveryCharges:number,
    totalAmount:number,
    orderItems:orderItemType[]
}
type propsType={
    orderId:number,
    setIsLoading:(value:boolean)=>void,
    setIsError:(value:boolean)=>void
}
type cancelOrderResponseType = {
  success: boolean;
  message: string;
  data: string;
};
type singleOrderDetailsResponse = {
  success: boolean;
  message: string;
  data: orderType;
};

function SingleOrderDetailsPageBody(props:propsType):React.JSX.Element{

  const [orderDetails,setOrderDetails]=useState<orderType>();
    const payPendingOrder = () => {};
    const cancelOrder = async () => {
    props.setIsLoading(true);
    try {
      const response = await api.patch<cancelOrderResponseType>(
        `/api/Account/canceluserorder/${props.orderId}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        props.setIsLoading(false);
        setOrderDetails((prevOrder:orderType|undefined) => {
          if (!prevOrder) {return undefined};

          return {...prevOrder,orderStatus:"Cancelled By Customer"}
      })
    } 
  }catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: cancelOrderResponseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          props.setIsLoading(false);
          props.setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          toast(responseData.message);
        }
      }
    }
  };
  const convertToLocalTime = (universalTime: string): string => {
    try {
      const dateObj = new Date(universalTime);
      if (isNaN(dateObj.getTime())) {
        return "";
      }
      return dateObj.toLocaleString("en-PK", {
        timeZone: "Asia/Karachi",
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };
    
  
  useEffect(()=>{
    const getSingleOrderDetails=async()=>{
    try {
      const response = await api.get<singleOrderDetailsResponse>(
        `/api/Account/getsingleorderdetails/${props.orderId}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        props.setIsLoading(false);
        setOrderDetails(response.data.data)
    } 
  }catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: cancelOrderResponseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          props.setIsLoading(false);
          props.setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          toast(responseData.message);
        }
      }
    }
  };
  getSingleOrderDetails();
  },[])

    return(
      <div className={styles.mainbody}>
        {orderDetails&&<div className={styles.orderdetails}>
                <div className={styles.ordermaindetails}>
                    <div><p>{`Order Id: ${orderDetails.orderId}`}</p></div>
                    <div><p>{`Created at: ${convertToLocalTime(orderDetails.createdAt)}`}</p></div>
                    <div><p>{`Paid at: ${convertToLocalTime(orderDetails.paidAt)}`}</p></div>
                    <div><p>{`Order status: ${orderDetails.orderStatus}`}</p></div>
                    <div><p>{`Payment Method: ${orderDetails.paymentMethodName}`}</p></div>
                    <div><p>{`Payment Method Carges: ${orderDetails.paymentMethodCharges}`}</p></div>
                    <div><p>{`Delivery Charges: ${orderDetails.deliveryCharges}`}</p></div>
                    <div><p>{`Total Amount: ${orderDetails.totalAmount}`}</p></div>
                    {orderDetails.orderStatus === "Awaiting Payment" && (
                <button
                  onClick={payPendingOrder}
                  className={styles.paynow}
                  value={orderDetails.orderId}
                >
                  Pay Now
                </button>
              )}
              {orderDetails.orderStatus === "Pending" && (
                <button
                  data-order-id={orderDetails.orderId}
                  onClick={cancelOrder}
                  className={styles.cancelbutton}
                  value={orderDetails.orderId}
                >
                  Cancel
                </button>
              )}

                </div>
                <SingleOrderDetailsPageOrderItemsContainer orderItems={orderDetails.orderItems} ></SingleOrderDetailsPageOrderItemsContainer>
        </div>}

      </div>
            

        
    )
}
export default SingleOrderDetailsPageBody;