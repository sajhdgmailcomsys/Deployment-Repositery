import type React from "react";
import styles from "./SingleOrderDetailsPageOrderItemsContainer.module.css";
import SingleOrderDetailsPageOrderItem from "./SingleOrderDetailsPageOrderItem";
type orderItemType={
    description:string,
    imageURL:string,
    unitPrice:number,
    subTotal:number
    quantity:number
}
type propsType={
    orderItems:orderItemType[]
}
function SingleOrderDetailsPageOrderItemsContainer(props:propsType):React.JSX.Element{
    return(
        <div className={styles.orderitemsContainer}>
            {props.orderItems&&props.orderItems.map(orderItem=>(
                <SingleOrderDetailsPageOrderItem
                
                description={orderItem.description}
                unitPrice={orderItem.unitPrice}
                subTotal={orderItem.subTotal}
                imageURL={orderItem.imageURL}
                quantity={orderItem.quantity}

                ></SingleOrderDetailsPageOrderItem>
            ))}  

        </div>
    )
}
export default SingleOrderDetailsPageOrderItemsContainer;