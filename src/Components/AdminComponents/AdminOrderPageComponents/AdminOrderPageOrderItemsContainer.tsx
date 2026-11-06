import type React from "react";
import styles from "./AdminOrderPageOrderItemsContainer.module.css";

type orderItemType={
    description: string,
    unitPrice: number,
    subTotal: number,
    quantity: number,
    imageURL:string
}

interface propsType {
  orderItems: orderItemType[];
  isItemContainerOpen: boolean;
}
function AdminOrderPageOrderItemsContainer(
  props: propsType,
): React.JSX.Element {
  return (
    <div
      data-is-order-item-container-open={
        props.isItemContainerOpen ? "true" : "false"
      }
      className={styles.orderitemscontainer}
    >
      <div>
        {props.orderItems.map((orderItem, itemIndex) => (
          <div key={itemIndex} className={styles.orderitem}>
            <div className={styles.orderitemimage}>
              <img src={orderItem.imageURL} alt="Order item image" />
            </div>
            <div className={styles.orderitemdetails}>
              <div className={styles.orderitemdescription}>
                <p>{orderItem.description}</p>
              </div>
              <div className={styles.orderitemquantity}>
                <p>Quantity: {orderItem.quantity}</p>
              </div>
              <div className={styles.orderitemunitprice}>
                <p>Unit price: PKR {orderItem.unitPrice}</p>
              </div>
              <div className={styles.orderitemsubtotal}>
                <p>Sub Total: PKR {orderItem.subTotal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminOrderPageOrderItemsContainer;
