import type React from "react";
import styles from "./SingleOrderDetailsPageOrderItem.module.css";
type propsType={
    description:string,
    imageURL:string,
    quantity:number
    subTotal:number
    unitPrice:number,
}
function SingleOrderDetailsPageOrderItem(props:propsType):React.JSX.Element{
    return(
        <div className={styles.orderItem}>
            <div><img src={props.imageURL} alt="" /></div>
            <div>{props.description}</div>
            <div>{`Quantity:${props.quantity}`}</div>
            <div>{`Unit Price:${props.unitPrice}`}</div>
            <div>{`Sub Total:${props.subTotal}`}</div>
        </div>

    )
}
export default SingleOrderDetailsPageOrderItem;