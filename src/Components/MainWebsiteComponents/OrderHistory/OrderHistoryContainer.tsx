import type React from "react";
import styles from "./OrderHistoryContainer.module.css";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderHistoryCard from "./OrderHistoryCard";

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

function OrderHistoryContainer(props: propsType): React.JSX.Element {
  const [orderHistoryData, setOrderHistoryData] = useState<userOrderType[]>([]);
  
  

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
            props.setIsLoading(false);
            toast.error(responseData.message);
          }
        }
      }
    };
    getOrderHistory();
  }, []);

  return (
    <div className={styles.orderhistoryscreen}>
      <div className={styles.orderhistorycontainer}>
        {
          orderHistoryData.length!==0?
          orderHistoryData.map((order, index) => (
            <OrderHistoryCard setOrderHistoryData={setOrderHistoryData} setIsError={props.setIsError} setIsLoading={props.setIsLoading} totalItems={order.totalItems} totalAmount={order.totalAmount} createdAt={order.createdAt} deliveryCharges={order.deliveryCharges} orderId={order.orderId} orderStatus={order.orderStatus} paymentMethodCharges={order.paymentMethodCharges} index={index}  ></OrderHistoryCard>
          )):(
            <div className={styles.noordersyet}>
              <p>No orders made yet.</p>
            </div>
          )
        }
        
        
      </div>
    </div>
  );
}
export default OrderHistoryContainer;
