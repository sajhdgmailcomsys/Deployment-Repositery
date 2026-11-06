import type React from "react";
import styles from "./AdminOrderPageHeader.module.css";
interface propsType{
    ordersCount:number
    selectedStatus:string;
    setSelectedStatus:(value:string)=>void
}
function AdminOrderPageHeader(props:propsType):React.JSX.Element{

    const handleSelectedStatusChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    props.setSelectedStatus(event.target.value);
  };
 




    return(
        <div className={styles.header}>
            <div className={styles.headertext}>
                <p>Paradise Super Store</p>
            </div>
            <div className={styles.orderstatusselectdiv}>
        <select className={styles.orderstatusselect} value={props.selectedStatus} onChange={handleSelectedStatusChange}>
            <option value="Shipped">Shipped</option>
            <option value="Awaiting Payment">Awaiting Payment</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled By Customer">Cancelled By Customer</option>
            <option value="Cancelled By Admin">Cancelled By Admin</option>
            <option value="Delivered">Delivered</option>
        </select>
    </div>
    <div className={styles.orderscountdiv}>
        <p>{props.ordersCount}</p>
        <div className={styles.orderscountdivpopup}>
            <p>{`${props.ordersCount} Orders`}</p>
        </div>
        
    </div>
        </div>

    );

}
export default AdminOrderPageHeader;