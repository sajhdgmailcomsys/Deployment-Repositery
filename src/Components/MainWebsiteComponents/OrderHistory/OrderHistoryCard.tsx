import { useNavigate } from "react-router-dom";
import styles from "./OrderHistoryCard.module.css";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import orderIcon from "../../../assets/Order.png";
import type React from "react";
import { toast } from "sonner";

type propsType={
    orderId: number;
  orderStatus: string;
  createdAt: string;
  paymentMethodCharges: number;
  deliveryCharges: number;
  totalItems: number;
  totalAmount: number;
  index:number;
  setIsLoading: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setOrderHistoryData:React.Dispatch<React.SetStateAction<userOrderType[]>>;

}

type userOrderType = {
  orderId: number;
  orderStatus: string;
  createdAt: string;
  paymentMethodCharges: number;
  deliveryCharges: number;
  totalItems: number;
  totalAmount: number;
};

type cancelOrderResponseType = {
  success: boolean;
  message: string;
  data: string;
};



function OrderHistoryCard (props: propsType):React.JSX.Element{

      const navigate = useNavigate();


    const payPendingOrder = () => {};
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
  const seeFullOrderDeTails=(event:React.MouseEvent<HTMLDivElement>):void=>{
    const orderId= event.currentTarget.getAttribute("data-order-id");
    navigate(`/singleorderdetails?orderId=${orderId}`)
  }
  const cancelOrder = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const orderId = Number(event.currentTarget.getAttribute("data-order-id"));
    props.setIsLoading(true);
    try {
      const response = await api.patch<cancelOrderResponseType>(
        `/api/Account/canceluserorder/${orderId}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        props.setIsLoading(false);
        props.setOrderHistoryData((prevOrders: userOrderType[]) => {
          return prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: "Cancelled By Customer" }
              : order,
          );
        });
      }
    } catch (error) {
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
    return(
        <div onClick={seeFullOrderDeTails} data-order-id={props.orderId} className={styles.order} key={props.index}>
              <img src={orderIcon} alt="" />
              <p
                className={styles.orderId}
                title="Click to copy full ID"
                onClick={() => {
                  navigator.clipboard.writeText(String(props.orderId));
                  alert("Order ID copied to clipboard!");
                }}
              >{`order ID: ${props.orderId}`}</p>
              <time dateTime={props.createdAt}>
                {convertToLocalTime(props.createdAt)}
              </time>
              <p>{`Total Items: ${props.totalItems}`}</p>
              <p>{`Delivery Charges: ${props.deliveryCharges}`}</p>
              <p>{`PKR ${props.totalAmount}`}</p>
              <p>{`Status: ${props.orderStatus}`}</p>
              {props.orderStatus === "Awaiting Payment" && (
                <button
                  onClick={payPendingOrder}
                  className={styles.paynow}
                  value={props.orderId}
                >
                  Pay Now
                </button>
              )}
              {props.orderStatus === "Pending" && (
                <button
                  data-order-id={props.orderId}
                  onClick={cancelOrder}
                  className={styles.cancelbutton}
                  value={props.orderId}
                >
                  Cancel
                </button>
              )}
            </div>


    )
}

export default OrderHistoryCard;