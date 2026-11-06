import type React from "react";
import styles from "./AdminUpdateProductPriceOrStockPage.module.css";
import { useState } from "react";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { toast, Toaster } from "sonner";
import AdminProductManagementPageHeader from "../../Components/AdminComponents/AdminProductManagementPagesComponents/AdminProductManagementPageHeader";
import { useForm } from "react-hook-form";
import {
  updateProductPriceOrStockSchema,
  type UpdateProductPriceOrStockInputType,
  type UpdateProductPriceOrStockOutputType,
} from "../../Schemas/AdminSchemas/UpdateProductPriceOrStockSchema";

type productSuggestionsType={
  productId:number,
  productName:string
  costPrice:number,
  sellingPrice:number,
  stock:number,
  isFeatured:boolean
}
type updateProductResponseType={
  success:boolean,
  message:string,
  data:string
}

import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";

function AdminUpdateProductPriceOrStock(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [productSuggestions,setProductSuggestions]=useState<productSuggestionsType[]>([]);
  const [closeProductSuggestions,setCloseProductSuggestions]=useState<boolean>(true);
  const productSuggestionsLimit=5;
  const [stockUpdateMode,setStockUpdateMode]=useState<string>("Add Stock");
  
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<
    UpdateProductPriceOrStockInputType,
    unknown,
    UpdateProductPriceOrStockOutputType
  >({
    resolver: zodResolver(updateProductPriceOrStockSchema),
  });
  const showProductSuggestions = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const paritalSearch = event.currentTarget.value;
    if(paritalSearch==="")
    {
      setProductSuggestions([]);
      setCloseProductSuggestions(true);
      return;
    }
    try {
      
      const response = await api.get<productSuggestionsType[]>(
        `/api/Admin/getproductsuggestions/${paritalSearch}/${productSuggestionsLimit}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        if(response.data.length===0)
        {
          setCloseProductSuggestions(true);
          return;
        }
        setCloseProductSuggestions(false);
        
        setProductSuggestions(response.data);
        
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
      }
    }
  };
  const updateProductPriceOrStock = async (data:UpdateProductPriceOrStockOutputType) => {
    const product:productSuggestionsType|undefined=productSuggestions.find(product=>product.productName===data.productName);
    if(product===undefined){
      setError("productName",{message:"Please select a valid product."});
      return;
    }
    const fieldMapping:Record<string,keyof typeof product>={
      newCostPrice:"costPrice",
      newSellingPrice:"sellingPrice",
      newStock:"stock",
      isFeatured:"isFeatured"

    }
    
    const {productName,...refinedData}=data;
    const changedProperties=Object.fromEntries(
      Object.entries(refinedData).filter(([key,value])=>{
        const originalKey= fieldMapping[key];
        return originalKey?value!==product[originalKey]:true;
      })
    )
    if(Object.keys(changedProperties).length===0)
    {
      toast("No properties were changed.");
      return;
    }
    
    const finalData= {...changedProperties,stockUpdateMode:stockUpdateMode,productId:product.productId};
    console.log(finalData);

    try {
      setIsLoading(true);
      const response = await api.put<updateProductResponseType>(
        `/api/Admin/updateproductpriceorstock`,
        finalData
      );
      if (response.status == HttpStatusCode.Ok) {
        reset();
        setProductSuggestions([]);
        setIsLoading(false);
        toast("Product was updated successfully.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData:updateProductResponseType=error.response?.data;
        if (error.code === "ERR_NETWORK") {
          setIsLoading(false);
          setIsError(true);
        }
        if(error.status===HttpStatusCode.BadRequest)
        {
          setIsLoading(false);
          setError("newStock",{message:responseData.message});
        }
      }
    }



  };
  const handleProductSuggestionClick=(event:React.MouseEvent<HTMLButtonElement>)=>{
    const productName= event.currentTarget.getAttribute("data-product-name")??"";
    const selectedProduct= productSuggestions.find(product=>product.productName===productName);
    if(selectedProduct===undefined){
      return;
    }
    setValue("productName",productName);
    setValue("newCostPrice",selectedProduct.costPrice);
    setValue("newSellingPrice",selectedProduct.sellingPrice);
    setValue("newStock",selectedProduct.stock);
    setValue("isFeatured",selectedProduct.isFeatured);
    setCloseProductSuggestions(true);
  }
  
  const closeProductSuggestionsFunction=()=>{
    setCloseProductSuggestions(true);
  }
  return (
    <div
      className={styles.mainbackground}
      
    >
      <ErrorScreen1 isError={isError}></ErrorScreen1>
      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
      <Toaster position="top-center" closeButton={true} />
      <div
        style={{ display: isError || isLoading ? "none" : "flex" }}
        className={styles.background}
      >
        <AdminProductManagementPageHeader></AdminProductManagementPageHeader>
        <div className={styles.mainbody}>
          <div className={styles.formcontainer}>
            <form onSubmit={handleSubmit(updateProductPriceOrStock)}>
              <div className={styles.productname}>
                <label>Product Name *</label>
                <input type="text" {...register("productName",{onChange:showProductSuggestions,onBlur:closeProductSuggestionsFunction})} />
                <div data-close-product-suggestions={closeProductSuggestions} className={styles.productsuggestions}>
                  {productSuggestions.map((productSuggestion,index)=>(
                    <div key={index} className={styles.productsuggestion}>
                      <button data-product-name={productSuggestion.productName} onMouseDown={handleProductSuggestionClick} type="button">{productSuggestion.productName}</button>
                    </div>
                  ))}
                </div>
                {errors.productName && (
                  <p className={styles.errortext}>
                    {errors.productName?.message}
                  </p>
                )}
              </div>
              <div className={styles.newCostPrice}>
                <label>Cost Price *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("newCostPrice", { valueAsNumber: true })}
                />
                {errors.newCostPrice && (
                  <p className={styles.errortext}>{errors.newCostPrice.message}</p>
                )}
              </div>
              <div className={styles.newSellingPrice}>
                <label>Selling Price *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("newSellingPrice", { valueAsNumber: true })}
                />
                {errors.newSellingPrice && (
                  <p className={styles.errortext}>
                    {errors.newSellingPrice.message}
                  </p>
                )}
              </div>
              <div className={styles.newStock}>
                <label>newStock *</label>
                <input
                  type="number"
                  {...register("newStock", { valueAsNumber: true })}
                />
                <select value={stockUpdateMode} onChange={(event)=>setStockUpdateMode(event.target.value)} id={styles.stockupdatemode}>
                  <option value="Add Stock">Add newStock</option>
                  <option value="Set Stock">Set newStock</option>
                </select>
                {errors.newStock && (
                  <p className={styles.errortext}>{errors.newStock.message}</p>
                )}
              </div>
              <div className={styles.isfeaturedcheckbox}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  {...register("isFeatured")}
                />
                <label htmlFor="isFeatured">
                  Feature this product on homepage
                </label>
              </div>
              <button className={styles.submitbutton}
              type="submit"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? "Saving..." : "Update Product"}
            </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminUpdateProductPriceOrStock;
