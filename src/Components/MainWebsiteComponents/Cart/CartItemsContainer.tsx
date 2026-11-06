import type React from "react";
import styles from "./CartItemsContainer.module.css";
import EmptyCart from "./EmptyCart";
import CartItemCard from "./CartItemCard";

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
type propsType={
  cartItemsData:cartItemType[];
  setCartItemsData: React.Dispatch<React.SetStateAction<cartItemType[]>>,
  setIsLoading:(value:boolean)=>void,
  setIsError:(value:boolean)=>void
}


function CartItemsContainer(props:propsType):React.JSX.Element{

  



    return(
        <div className={styles.cartproducts}>
            {props.cartItemsData.length>0?
              props.cartItemsData.map((product:cartItemType) => (
                <CartItemCard
                setIsError={props.setIsError}
                setIsLoading={props.setIsLoading}
                setCartItemsData={props.setCartItemsData}
                key={product.productId}
                stock={product.stock}
                  subTotal={product.subTotal}
                  productId={product.productId}
                  productUnitPrice={product.productUnitPrice}
                  description={product.description}
                  imageURL={product.imageURL}
                  quantity={product.quantity}
                  cartItemId={product.cartItemId}
                  unit={product.unit}
                  
                ></CartItemCard>
              )):<EmptyCart></EmptyCart>}
          </div>
    )
}

export default CartItemsContainer;