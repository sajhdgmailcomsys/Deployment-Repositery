import type React from "react";
import styles from "./PaymentMethodCard.module.css";
interface propsType{
    paymentMethodIconUrl:string;
    paymentMethodId:number;
    description:string;
    onSelect:(id:number)=>void
    isSelected:boolean
    paymentMethodFee:number
    
}


function PaymentMethodCard(props:propsType):React.JSX.Element{
    return(
        <div key={props.paymentMethodId} className={`${styles.paymentmethodcard} ${props.isSelected?"selected":""}`}
        onClick={()=>props.onSelect(props.paymentMethodId)}
        
        >
            <div className={styles.iconWrapper}><img src={props.paymentMethodIconUrl} alt="" /></div>
            <div className={styles.contentWrapper}
            ><p>{props.description}</p>
            <div className={styles.paymentMethodFee}><p>+PKR {props.paymentMethodFee}</p></div>
            </div>
            

        </div>
        

    )
}

export default PaymentMethodCard;

