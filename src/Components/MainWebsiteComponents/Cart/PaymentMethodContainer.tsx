import type React from "react";
import styles from "./PaymentMethodContainer.module.css";
import PaymentMethodCard from "./PaymentMethodCard";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface propsType{
    selectedMethodId:number;
    setSelectedMethodId:(id: number) => void;
    setIsError:(value:boolean)=>void;
}
type cartPaymentGatewayType={
  id:number,
  name:string,
  imageURL:string,
  paymentGatewayFee:number
}
type responseType = {
  success: boolean;
  message: string;
 data:cartPaymentGatewayType[];
};




function PaymentMethodContainer(props:propsType):React.JSX.Element{
  const [cartPaymentGatewaysData,setCartPaymentGatewaysData]=useState<cartPaymentGatewayType[]>([]);

  
  useEffect(()=>{
    const getAllPaymentGateways= async()=>{

    try{
      const response=await api.get<responseType>(`/api/Cart/getpaymentgatewaysdetail/Cash`);
    if(response.status==HttpStatusCode.Ok)
      {
        setCartPaymentGatewaysData(response.data.data);
      }

    }catch(error){

      if(axios.isAxiosError(error))
    {
      const responseData:responseType=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        props.setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message,{
              duration:5000
            });
          
        }
    }

    }
  };
  getAllPaymentGateways();

  },[props]);

    return(
        <div className={styles.paymentmethodcontainer}>
            <div className={styles.title}><p>Select your payment method.</p></div>
            <div className={styles.cardscontent}>
            {cartPaymentGatewaysData&&cartPaymentGatewaysData.map((paymentMethod)=>(
                <PaymentMethodCard paymentMethodFee={paymentMethod.paymentGatewayFee} description={paymentMethod.name}
                paymentMethodIconUrl={paymentMethod.imageURL}
                paymentMethodId={paymentMethod.id}
                isSelected={props.selectedMethodId === paymentMethod.id}
                onSelect={props.setSelectedMethodId}
                ></PaymentMethodCard>
            )

            )}</div>
            
        </div>

    )

}
export default PaymentMethodContainer;