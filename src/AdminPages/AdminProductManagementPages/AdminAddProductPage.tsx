import type React from "react";
import styles from "./AdminAddProductPage.module.css";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { toast, Toaster } from "sonner";
import AdminProductMangementPageHeader from "../../Components/AdminComponents/AdminProductManagementPagesComponents/AdminProductManagementPageHeader";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addNewProductSchema,
  type AddNewProductSchemaTypeInput,
  type AddNewProductSchemaTypeOutput,
} from "../../Schemas/AdminSchemas/AddNewProductPageSchema";
import { useState } from "react";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";

type categorySuggestionType = {
  categoryName: string;
};
type brandSuggestionType = {
  brandName: string;
};

type addNewProductResponseType = {
  success:boolean,
  message:string,
  data:string
};



function AdminAddProductPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [categorySuggestions, setCategorySuggestions] = useState<
    categorySuggestionType[]
  >([]);
  const [brandSuggestions, setBrandSuggestions] = useState<
    brandSuggestionType[]
  >([]);
  const categorySuggestionsLimit = 5;
  const brandSuggestionsLimit = 5;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<
    AddNewProductSchemaTypeInput,
    unknown,
    AddNewProductSchemaTypeOutput
  >({
    resolver: zodResolver(addNewProductSchema),
    defaultValues: {
      description: "",
      costPrice: 0,
      sellingPrice: 0,
      categoryName: "",
      brandName: "",
      primaryImageURL: "",
      productImageURLs: [],
      detailedDescription: "",
      stock: 0,
      isFeatured: false,
      unit: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productImageURLs" as never,
  });

  const addNewProduct = async (data: AddNewProductSchemaTypeOutput) => {
    try {
      setIsLoading(true);
      const response = await api.post<addNewProductResponseType>(
        "/api/Admin/addnewproduct",data
      );
      if (response.status == HttpStatusCode.Ok) {
        setIsLoading(false);
        console.log(data);
        toast("New product added to database successfully.");
        reset();
        
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        const responseData:addNewProductResponseType=error.response?.data;
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast(responseData.message);
        }
      }
    }
  };
  const showBrandSuggestions = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const paritalSearch = event.currentTarget.value;
    if(paritalSearch==="")
    {
      setBrandSuggestions([]);
      return;
    }
    try {
      const response = await api.get<brandSuggestionType[]>(
        `/api/Admin/getbrandsuggestions/${paritalSearch}/${brandSuggestionsLimit}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        setBrandSuggestions(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
      }
    }
  };
  const showCategorySuggestions = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const paritalSearch = event.currentTarget.value;
    if(paritalSearch==="")
    {
      setCategorySuggestions([]);
      return;
    }
    try {
      const response = await api.get<categorySuggestionType[]>(
        `/api/Admin/getcategorysuggestions/${paritalSearch}/${categorySuggestionsLimit}`,
      );
      if (response.status == HttpStatusCode.Ok) {
        setCategorySuggestions(response.data);
        console.log(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
      }
    }
  };
  const handleCategoryClick=(event:React.MouseEvent<HTMLButtonElement>)=>{
    const categoryName= event.currentTarget.getAttribute("data-category-name")??"";
    setValue("categoryName",categoryName);
    setCategorySuggestions([]);
  }
  const handleBrandClick=(event:React.MouseEvent<HTMLButtonElement>)=>{
    const brandName= event.currentTarget.getAttribute("data-brand-name")??"";
    setValue("brandName",brandName);
    setBrandSuggestions([]);
  }
  const removeCategorySuggestions=()=>{
    setCategorySuggestions([]);
  }
  const removeBrandSuggestions=()=>{
    setBrandSuggestions([]);
  }

  return (
    <div
      className={styles.mainbackground}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <ErrorScreen1 isError={isError}></ErrorScreen1>
      <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
      <Toaster position="top-center" closeButton={true} />
      <div
        style={{ display: isError || isLoading ? "none" : "flex" }}
        className={styles.background}
      >
        <AdminProductMangementPageHeader></AdminProductMangementPageHeader>
        <div>
          <form onSubmit={handleSubmit(addNewProduct)}>
            <div className={styles.description}>
              <label>Description *</label>
              <input {...register("description")}  />
              {errors.description && (
                <p className={styles.errortext} >{errors.description.message}</p>
              )}
            </div>

            {/* Cost Price */}
            <div className={styles.costprice}>
              <label>Cost Price *</label>
              <input
                type="number"
                step="0.01"
                {...register("costPrice", { valueAsNumber: true })}
              />
              {errors.costPrice && (
                <p className={styles.errortext} >{errors.costPrice.message}</p>
              )}
            </div>

            {/* Selling Price */}
            <div className={styles.sellingprice}>
              <label>Selling Price *</label>
              <input
                type="number"
                step="0.01"
                {...register("sellingPrice", { valueAsNumber: true })}
              />
              {errors.sellingPrice && (
                <p className={styles.errortext} >{errors.sellingPrice.message}</p>
              )}
            </div>

            {/* Category Name */}
            <div className={styles.categoryname}>
              <label>Category Name *</label>
              <input
                {...register("categoryName", {
                  onChange: showCategorySuggestions,
                  onBlur:removeCategorySuggestions
                })}
              />
              {
                categorySuggestions.length>0?
              <div className={styles.categorysuggestions}>
              {categorySuggestions.map((categorySuggestion:categorySuggestionType,index)=>(
                <div key={index}  className={styles.categorysuggestion}>
                  <button type="button" onMouseDown={handleCategoryClick}  data-category-name={categorySuggestion.categoryName}><p>{categorySuggestion.categoryName}</p></button>
                  
                </div>
              ))}
            </div>:""}
              {errors.categoryName && (
                <p className={styles.errortext} >{errors.categoryName.message}</p>
              )}
            </div>
            

            {/* Brand Name */}
            <div className={styles.brandname}>
              <label>Brand Name *</label>
              <input  {...register("brandName",{
                onChange: showBrandSuggestions,
                onBlur:removeBrandSuggestions
              })} />
              {brandSuggestions.length>0?
              <div className={styles.brandsuggestions}>
              {brandSuggestions.map((brandSuggestion:brandSuggestionType,index)=>(
                <div key={index}  className={styles.brandsuggestion}>
                  <button type="button" onMouseDown={handleBrandClick}  data-brand-name={brandSuggestion.brandName}><p>{brandSuggestion.brandName}</p></button>
                  
                </div>
              ))}
            </div>:""}
              {errors.brandName && (
                <p className={styles.errortext} >{errors.brandName.message}</p>
              )}
            </div>
            

            {/* Primary Image URL */}
            <div className={styles.primaryimage}>
              <label>Primary Image URL</label>
              <input
                type="url"
                {...register("primaryImageURL")}
              />
              {errors.primaryImageURL && (
                <p className={styles.errortext} >{errors.primaryImageURL.message}</p>
              )}
            </div>

            {/* Product Image URLs Array */}
            <div className={styles.productimages}>
              <label>Product Gallery Images</label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                >
                  <input
                    type="url"
                    {...register(`productImageURLs.${index}` as const)}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append("")}>
                + Add Gallery Image
              </button>
              {errors.productImageURLs && (
                <p className={styles.errortext} >
                  {errors.productImageURLs.message}
                </p>
              )}
            </div>

            {/* Detailed Description */}
            <div className={styles.detaileddescription}>
              <label>Detailed Description</label>
              <textarea
                {...register("detailedDescription")}
              />
              {errors.detailedDescription && (
                <p className={styles.errortext} >
                  {errors.detailedDescription.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className={styles.stock}>
              <label>Stock *</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                
              />
              {errors.stock && (
                <p className={styles.errortext}>{errors.stock.message}</p>
              )}
            </div>

            {/* Unit */}
            <div className={styles.unit}>
              <label>Unit (e.g., kg, pcs) *</label>
              <input type="text" {...register("unit")} />
              {errors.unit && (
                <p className={styles.errortext}>{errors.unit.message}</p>
              )}
            </div>

            {/* Is Featured */}
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

            {/* Submit Button */}
            <button className={styles.submitbutton}
              type="submit"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? "Saving..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AdminAddProductPage;
