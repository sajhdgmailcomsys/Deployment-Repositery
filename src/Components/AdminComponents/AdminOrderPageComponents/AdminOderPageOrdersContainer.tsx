import type React from "react";
import styles from "./AdminOderPageOrdersContainer.module.css";
import downArrow from "../../../assets/DownArrow.png";
import { useState } from "react";
import AdminOrderPageOrderItemsContainer from "./AdminOrderPageOrderItemsContainer";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
type orderItemType={
    description: string,
    unitPrice: number,
    subTotal: number,
    quantity: number,
    imageURL:string
}
type orderType={
    orderId:number,
    createdAt:string,
    paidAt:string|null,
    totalAmount:number,
    paymentMethodName:string,
    paymentMethodCharges:number,
    deliveryCharges:number,
    orderedBy:string,
    orderItems:orderItemType[]   
    address:string,
    contactNumber:string
}

interface propsType{
    setOrdersList:React.Dispatch<React.SetStateAction<orderType[]>>,
    setIsloading:(value:boolean)=>void,
    setIsError:(value:boolean)=>void,
    selectedStatus:string
    orderList:orderType[]
}
type responseType = {
  success: boolean;
  message: string;
};

function AdminOderPageOrdersContainer(props:propsType):React.JSX.Element{

    const [openOrderItemId, setOpenOrderItemId] = useState<number | null>(null);
const [openSetStatusId, setOpenSetStatusId] = useState<string | number | null>(null);

const convertToLocalTime = (universalTime: string|null): string => {
    if(universalTime===null)
    {
        return "";
    }
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

    
    const [newStatus, setNewStatus] = useState<Record<string | number, string>>({});
    const handleSetNewStatus= async(event:React.MouseEvent<HTMLButtonElement>)=>{
        const orderId= Number(event.currentTarget.getAttribute("data-order-id"));
        if (!orderId) return; 
        const statusToSend = newStatus[orderId] || props.selectedStatus;

        try{
            props.setIsloading(true);
            const response= await api.put<responseType>("api/Admin/changeorderstatus",{
                OrderId:orderId,
                NewStatus:statusToSend
            });
          if(response.status===HttpStatusCode.Ok)
          {
            props.setOrdersList((prev:orderType[]):orderType[]=>{
                return prev.filter(order=>order.orderId!==orderId);

            });
            
            props.setIsloading(false);
            
            toast.success(`Order status changed for order with id: ${orderId}`)
          }

        }catch(error){
            if (axios.isAxiosError(error)) {
        const responseData: responseType = error.response?.data;
        props.setIsloading(false);
        if (error.code === "ERR_NETWORK") {
          props.setIsError(true);
          toast.success("It seems like you are offline.");
        }
        if (error.status === HttpStatusCode.BadRequest) {
          toast.error(responseData.message);
          
        }
      }

        }
    }
    
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const orderId = event.target.getAttribute("data-order-id");
  if (!orderId) return; // Guard clause against missing IDs

  setNewStatus((prev) => ({
    ...prev,
    [orderId]: event.target.value,
  }));
};

  
    


    return(
        <div className={styles.orderscontainerscreen}>
    <div className={styles.orderscontainer}>
        {props.orderList.map((order, index) => {
            const isSetStatusOpen = openSetStatusId === order.orderId;
            const isItemContainerOpen = openOrderItemId === order.orderId;

            const currentOrderId = order.orderId ?? "";
            const currentSelectedStatus = newStatus[currentOrderId] || props.selectedStatus;

            return (
                <div key={index} className={styles.order}>
                    
                    <div className={styles.setorderstatuscontainer}>
                        <div>
                            <button onClick={() => setOpenSetStatusId(isSetStatusOpen ? null : order.orderId)}>
                                Set Order Status
                            </button>
                        </div>
                        <div data-is-set-order-status-container-open={isSetStatusOpen ? "true" : "false"}>
                            <div>
                                <label htmlFor={`setneworderstatus-${order.orderId}`}>Order Status: </label>
                                <select data-order-id={currentOrderId} value={currentSelectedStatus} onChange={handleChange} id={`setneworderstatus-${order.orderId}`}>
                                    <option disabled={currentSelectedStatus === 'Shipped'} value="Shipped">Shipped</option>
                                    <option disabled={currentSelectedStatus === 'Pending'} value="Pending">Pending</option>
                                    <option disabled={currentSelectedStatus === 'Delivered'} value="Delivered">Delivered</option>
                                    <option disabled={currentSelectedStatus === 'Cancelled By Admin'} value="Cancelled By Admin">Cancelled By Admin</option>

                                </select>
                                <button data-order-id={order.orderId} onClick={handleSetNewStatus} className={styles.setnewstatusbutton} >Set New Status</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.orderdetails}>
                        <div className={styles.orderid}> <p>Order Id: {order.orderId}</p></div>
                        <div className={styles.orderedby}> <p>Ordered by: {order.orderedBy}</p></div>
                        <div className={styles.createdat}> <p>Created at: {convertToLocalTime(order.createdAt)}</p></div>
                        <div className={styles.paidat}> <p>Paid at: {order.paidAt?convertToLocalTime(order.paidAt):"Not yet."}</p></div>
                        <div className={styles.paymentmethod}> <p>Payment Method: {order.paymentMethodName}</p></div>
                        <div className={styles.paymentmethodfee}> <p>Payment Method Fee: PKR {order.paymentMethodCharges}</p></div>
                        <div className={styles.totalbill}> <p>Total Bill: PKR {order.totalAmount}</p></div>
                        <div className={styles.totalquantity}> <p>Total Quantity: {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}</p></div>
                        <div className={styles.address}> <p >Address: {order.address}</p></div>
                        <div className={styles.contactnumber}> <p>Contact Number: {order.contactNumber}</p></div>
                        <div className={styles.deliverycharges}> <p>Delivery Charges: {order.deliveryCharges}</p></div>
                        
                        
                        
                        <div className={styles.downarrowbutton}>
                            <button onClick={() => setOpenOrderItemId(isItemContainerOpen ? null : order.orderId)}>
                                <img src={downArrow} alt="Toggle items" />
                            </button>
                        </div>
                    </div>

                    <AdminOrderPageOrderItemsContainer isItemContainerOpen={isItemContainerOpen} orderItems={order.orderItems}></AdminOrderPageOrderItemsContainer>

                </div>
            );
        })}
    </div>
</div>

    );
}
export default AdminOderPageOrdersContainer;