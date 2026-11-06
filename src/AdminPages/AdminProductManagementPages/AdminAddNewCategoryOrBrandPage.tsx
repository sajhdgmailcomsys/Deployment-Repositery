import { toast, Toaster } from "sonner";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import styles from "./AdminAddNewCategoryOrBrandPage.module.css";
import React, { useState } from "react";
import AdminAddNewCategoryPageHeader from "../../Components/AdminComponents/AdminProductManagementPagesComponents/AdminAddNewCategoryPageHeader";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";


type addNewCategoryRequestDataType = {
  NewCategoryName:string
};

type addNewBrandRequestDataType = {
  NewBrandName:string
};

type addNewCategoryResponseType = {
  success:boolean,
  message:string,
  data:string
};

type addNewBrandResponseType = {
  success:boolean,
  message:string,
  data:string
};

function AdminAddNewCategoryOrBrandPage(): React.JSX.Element {
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);
  const [isBrandLoading, setIsBrandLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [newBrandName, setNewBrandName] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(event.target.value);
  };
  const handleNewBrandNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewBrandName(event.target.value);
  };

  const addNewCategoryFunction= async ()=>{
    const data:addNewCategoryRequestDataType={
      NewCategoryName:newCategoryName
    };
    try{
      setIsCategoryLoading(true);

      const response = await api.post<addNewCategoryResponseType>(
        `/api/Admin/addnewcategory`,data
      );
      if (response.status == HttpStatusCode.Ok) {
        setIsCategoryLoading(false);
        setNewCategoryName("");
        toast.success("The New Category has been successfully saved.");
        

      }

    }catch (error){
      setIsCategoryLoading(false);
      if (axios.isAxiosError(error)) {
        const responseData:addNewCategoryResponseType=error.response?.data;
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message);
        }
      }

    }


  }
  const addNewBrandFunction= async ()=>{
    const data:addNewBrandRequestDataType={
      NewBrandName:newBrandName
    };

    try{
      setIsBrandLoading(true);

      const response = await api.post<addNewBrandResponseType>(
        `/api/Admin/addnewbrand`,data
      );
      if (response.status == HttpStatusCode.Ok) {
        setIsBrandLoading(false);
        toast.success("The New Brand has been successfully saved.");
        setNewBrandName("");

      }

    }catch (error){
      setIsBrandLoading(false);
      if (axios.isAxiosError(error)) {
        const responseData:addNewBrandResponseType=error.response?.data;
        if (error.code === "ERR_NETWORK") {
          setIsError(true);
        }
        if(error.status===HttpStatusCode.BadRequest)
        {
          toast.error(responseData.message);
        }
      }

    }

    

  }

  return (
    <div
      className={styles.mainbackground}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <ErrorScreen1 isError={isError}></ErrorScreen1>
      
      <Toaster position="top-center" closeButton={true} />
      <div
        style={{ display: isError  ? "none" : "flex" }}
        className={styles.background}
      >
        <AdminAddNewCategoryPageHeader></AdminAddNewCategoryPageHeader>
        <div className={styles.mainbody}>
          <div className={styles.newcategoryform}>
            <div style={{display: isCategoryLoading? "block" : "none"}} className={styles.categoryloadingscreen}>
                <LoadingScreen1 message="" isLoading={isCategoryLoading}></LoadingScreen1>
            </div>
            

            
            <div className={styles.categoryinnercontainer}>
              <h1>Create New Category</h1>
              <div className={styles.categoryinput}>
                <label htmlFor="categoryinput">Category Name:</label>
                <input
                  id="categoryinput"
                  value={newCategoryName}
                  onChange={handleCategoryChange}
                  type="text"
                  placeholder="Enter Category Name"
                />
              </div>

              <button onClick={addNewCategoryFunction}>Create The Category</button>
            </div>
          </div>
          <div className={styles.newbrandform}>
            <div style={{display: isBrandLoading? "block" : "none"}} className={styles.brandloadingscreen}>
                <LoadingScreen1 message="" isLoading={isBrandLoading}></LoadingScreen1>
            </div>
            <div className={styles.brandinnercontainer} >
                <h1>Create New Brand</h1>
            <div className={styles.brandinput}>
              <label htmlFor="brandinput">Brand Name:</label>
              <input
                id="brandinput"
                value={newBrandName}
                onChange={handleNewBrandNameChange}
                type="text"
                placeholder="Enter Brand Name"
              />
            </div>

            <button onClick={addNewBrandFunction}>Create The Brand</button>

            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddNewCategoryOrBrandPage;
