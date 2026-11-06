import type React from "react";
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import defaultImage from "../../../assets/DefaultImage.svg";
import api from "../../../API/Axios";
import axios, { HttpStatusCode } from "axios";
interface ProductCardProps {
  productId: number,
  imageURL: string|null,
  description: string,
  price: number,
  stock:number,
  unit:string,
  setIsError:(value:boolean)=>void,
}
type responseType={
  success:boolean,
  message:string,
  data:string
}
function ProductCard(props: ProductCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const openProductPge = (event: React.MouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement;
    if (target.closest(".addtocartbutton")) {
      return;
    } else {
      
      navigate(`/product?productId=${props.productId}`);
    }
  };
  const addToCart = async (): Promise<void> => {
    try{
  const response=await api.post<responseType>("/api/Cart/incrementcartitemquantity",{productId: props.productId,
  quantity: 1});
  if(response.status==HttpStatusCode.Ok)
  {
    toast.success(response.data.message);
  }

  }catch(error)
  { 
    if(axios.isAxiosError(error))
    {
      const responseData=error.response?.data;

        if (error.code === 'ERR_NETWORK') {
        props.setIsError(true);
        } 
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message);
        }
    }
  }
    
  };
  return (
    <div
      className={styles.productcard}
      onClick={openProductPge}
    >
      <img src={props.imageURL?props.imageURL:defaultImage} alt="Product Main Image." />
      <p className={styles.description}>{props.description}</p>
      <span className={styles.price}>PKR {props.price}</span>
      
      <button
        className={`addtocartbutton ${styles.addtocart}`}
        onClick={addToCart}
      >
        Add To Cart
      </button>
      <span className={styles.stock}>{`Stock: ${props.stock} ${props.unit}`}</span>
    </div>
  );
}
export default ProductCard;
