import type React from "react";
import styles from "./OrderHistoryContainer.module.css";
import orderIcon from "../../../assets/Order.png";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type propsType = {
  setIsLoading: (value: boolean) => void;
  setIsError: (value: boolean) => void;
};
type userOrderType = {
  orderId: number;
  orderStatus: string;
  createdAt: string;
  paymentMethodCharges: number;
  deliveryCharges: number;
  totalItems: number;
  totalAmount: number;
};
type responseType = {
  success: boolean;
  message: string;
  data: userOrderType[];
};
type cancelOrderResponseType = {
  success: boolean;
  message: string;
  data: string;
};

function OrderHistoryContainer(props: propsType): React.JSX.Element {
  const [orderHistoryData, setOrderHistoryData] = useState<userOrderType[]>([]);
  const navigate = useNavigate();
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
        setOrderHistoryData((prevOrders: userOrderType[]) => {
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

  useEffect(() => {
    const getOrderHistory = async () => {
      props.setIsLoading(true);
      try {
        const response = await api.get<responseType>(
          "/api/Account/orderhistory",
        );
        if (response.status == HttpStatusCode.Ok) {
          props.setIsLoading(false);
          setOrderHistoryData(response.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData: responseType = error.response?.data;

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
    getOrderHistory();
  }, []);

  return (
    <div className={styles.orderhistoryscreen}>
      <div className={styles.orderhistorycontainer}>
        {orderHistoryData &&
          orderHistoryData.map((order, index) => (
            <div onClick={seeFullOrderDeTails} data-order-id={order.orderId} className={styles.order} key={index}>
              <img src={orderIcon} alt="" />
              <p
                className={styles.orderId}
                title="Click to copy full ID"
                onClick={() => {
                  navigator.clipboard.writeText(String(order.orderId));
                  alert("Order ID copied to clipboard!");
                }}
              >{`order ID: ${order.orderId}`}</p>
              <time dateTime={order.createdAt}>
                {convertToLocalTime(order.createdAt)}
              </time>
              <p>{`Total Items: ${order.totalItems}`}</p>
              <p>{`Delivery Charges: ${order.deliveryCharges}`}</p>
              <p>{`PKR ${order.totalAmount}`}</p>
              <p>{`Status: ${order.orderStatus}`}</p>
              {order.orderStatus === "Awaiting Payment" && (
                <button
                  onClick={payPendingOrder}
                  className={styles.paynow}
                  value={order.orderId}
                >
                  Pay Now
                </button>
              )}
              {order.orderStatus === "Pending" && (
                <button
                  data-order-id={order.orderId}
                  onClick={cancelOrder}
                  className={styles.cancelbutton}
                  value={order.orderId}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
export default OrderHistoryContainer;
