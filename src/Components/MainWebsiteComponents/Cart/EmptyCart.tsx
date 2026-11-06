import type React from "react";
import styles from "./EmptyCart.module.css";
import emptyCartIcon from "../../../assets/CartIcon.svg";
function EmptyCart():React.JSX.Element{
    return(
        <div className={styles.emptycartscreen}>
            <img src={emptyCartIcon} alt="Cart is empty." />
            <p>No products in the cart yet.</p>

        </div>
    )
}
export default EmptyCart;