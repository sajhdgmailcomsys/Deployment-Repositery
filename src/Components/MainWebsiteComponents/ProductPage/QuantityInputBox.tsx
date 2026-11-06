import type React from "react";
import styles from "./QuantityInputBox.module.css";
import type { ChangeEvent } from "react";

interface propsType{
    setQuantity:(value:string)=>void,
    stock:number,
    unit:string,
    quantity:string,
}

function QuantityInputBox(props:propsType):React.JSX.Element{

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue: string = e.currentTarget.value;
        if(inputValue==="")
        {
          props.setQuantity("");
        }
    
        if (/^\d+$/.test(inputValue)) {
          const formatted: number = Number(inputValue);
          if (formatted <= props.stock) {
            props.setQuantity(String(formatted));
          }
        }
      };
      const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
          const inputValue: string = e.target.value;
          if (inputValue === "" || inputValue === "0") {
            props.setQuantity("1");
          } else {
            props.setQuantity(inputValue);
          }
        };
            


    return(
        <div className={styles.quantityinputcontainer}>
                <label htmlFor="quantityinput">Quantity</label>
                <input
                  type="text"
                  inputMode="numeric"
                  id={styles.quantityinput}
                  pattern="[0-9]*"
                  value={props.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Quantity"
                  disabled={props.stock===0?true:false}
                />
                <p className={styles.unit}>{props.unit}</p>
              </div>
    )
}
export default QuantityInputBox;