import type React from "react";
import styles from "./CartItemCard.module.css";
import { useState, type ChangeEvent } from "react";
import axios, { HttpStatusCode } from "axios";
import api from "../../../API/Axios";
import { toast } from "sonner";

type cartItemType = {
  cartItemId: number;
  productId: number;
  description: string;
  imageURL: string;
  quantity: number;
  productUnitPrice: number;
  subTotal: number;
  stock: number;
  unit: string;
};

interface propsType {
  cartItemId: number;
  productId: number;
  description: string;
  imageURL: string;
  quantity: number;
  productUnitPrice: number;
  subTotal: number;
  stock: number;
  unit: string;
  setCartItemsData: React.Dispatch<React.SetStateAction<cartItemType[]>>;
  setIsLoading: (value: boolean) => void;
  setIsError: (value: boolean) => void;
}
type removeCartItemsResponseType = {
  success: boolean;
  message: string;
  data: string;
};
type setNewQuantityResponse = {
  success: string;
  message: string;
  data: string;
};

function CartItemCard(props: propsType): React.JSX.Element {
  const [value, setValue] = useState<string>(String(props.quantity));
  const [previousValue,setPreviousValue]=useState<string>(String(props.quantity));

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue: string = e.target.value;

    
      

    if (inputValue === "") {
      setValue("");
      return;
    }

    if (/^\d+$/.test(inputValue)) {
      const numValue = Number(inputValue);

      if (numValue <= props.stock) {
        setValue(String(numValue));
      }
    }

    
  };

  const handleBlur = async (
    e: React.FocusEvent<HTMLInputElement>,
  ): Promise<void> => {
    const inputValue: string = e.target.value;
    if (inputValue === "") {
      setValue("1");
    }else if(inputValue===previousValue){
      return;

    }else {
      setValue(inputValue);
      setPreviousValue(inputValue);
    }

    try {
      props.setIsLoading(true);
      const response = await api.post<setNewQuantityResponse>(
        "/api/Cart/setcartitemquantity",
        {
          productId: Number(props.productId),
          quantity: Number(value),
        },
      );
      if (response.status == HttpStatusCode.Ok) {
        if(response.data.message==="Product removed from cart successfully."){
        props.setCartItemsData((prevCart:cartItemType[]):cartItemType[]=>{
          return prevCart.filter(x=>x.productId!==props.productId)

        })

        }
        props.setIsLoading(false);
        toast.success(response.data.message);
       props.setCartItemsData((prevCart: cartItemType[]): cartItemType[] => {
  return prevCart.map((cartItem) =>
    cartItem.productId === props.productId
      ? { ...cartItem, quantity: Number(value), subTotal: cartItem.productUnitPrice * Number(value) }
      : cartItem
  );
});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: setNewQuantityResponse = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          props.setIsLoading(false);
          props.setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          if (
            responseData.message === "Product removed from cart successfully."
          ) {
            props.setIsLoading(false);
            props.setCartItemsData((prevCart: cartItemType[]) => {
              return prevCart.filter(
                (cartItem) => cartItem.productId !== props.productId,
              );
            });
          } else {
            props.setIsLoading(false);
            toast.error(responseData.message);
          }
        }
      }
    }
  };
  const removeWholeCartItem = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    const cartItemId: number = Number(
      event.currentTarget.getAttribute("data-cart-item-id"),
    );
    props.setIsLoading(true);
    try {
      const response = await api.delete<removeCartItemsResponseType>(
        `/api/Cart/removewholecartitem/${cartItemId}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        props.setIsLoading(false);
        props.setCartItemsData((prevCart: cartItemType[]) => {
          return prevCart.filter(
            (cartItem) => cartItem.cartItemId !== cartItemId,
          );
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData: removeCartItemsResponseType = error.response?.data;
        if (error.code === "ERR_NETWORK") {
          props.setIsLoading(false);
          props.setIsError(true);
        }
        if (error.status === HttpStatusCode.BadRequest) {
          toast(responseData.message);
        }
      }
    }
  };

  return (
    <div key={props.productId} className={styles.cartproduct}>
      <div>
        <img src={props.imageURL} alt="" />
      </div>
      <div>
        <p>{props.description}</p>
        <p>{`Unit Price: PKR ${props.productUnitPrice}`}</p>
        <p>{`Sub Total: PKR ${props.subTotal}`}</p>
        <div className={styles.quantityinput}>
        <input
          type="text"
          inputMode="numeric"
          id={styles.quantityinput}
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Quantity"
          disabled={props.stock === 0 ? true : false}
        />
        <p>{props.unit}</p>
        </div>
        <button
          data-cart-item-id={props.cartItemId}
          onClick={removeWholeCartItem}
        >
          Remove Product
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
