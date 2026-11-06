import type React from "react";
import styles from "./AdminOrderPage.module.css";
import ErrorScreen1 from "../../Components/SharedComponents/ErrorScreens/ErrorScreen1/ErrorScreen1";
import LoadingScreen1 from "../../Components/SharedComponents/LoadingScreens/LoadingScreen1/LoadingScreen1";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import AdminOrderPageHeader from "../../Components/AdminComponents/AdminOrderPageComponents/AdminOrderPageHeader";
import AdminOderPageOrdersContainer from "../../Components/AdminComponents/AdminOrderPageComponents/AdminOderPageOrdersContainer";
import api from "../../API/Axios";
import axios, { HttpStatusCode } from "axios";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

type orderItemType={
    description: string,
    unitPrice: number,
    subTotal: number,
    quantity: number,
    imageURL:string
}
type orderType={
    orderId:number,
    createdAt:string,
    paidAt:string|null,
    totalAmount:number,
    paymentMethodName:string,
    paymentMethodCharges:number,
    deliveryCharges:number
    orderedBy:string,
    orderItems:orderItemType[]   
    address:string,
    contactNumber:string
}
type responseType = {
  success: boolean;
  message: string;
  data:orderType[]
};
type refreshTokenResponseType = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};




function AdminOrderPage():React.JSX.Element{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedStatus,setSelectedStatus]=useState<string>("Pending");
    const [ordersList,setOrdersList]= useState<orderType[]>([]);
    const navigate= useNavigate();

    useEffect(() => {
      const handleOnline = () => {
      setIsError(false);
        };
      
      window.addEventListener("online", handleOnline);
        
      return () => window.removeEventListener("online", handleOnline);
    }, []);
    useEffect(()=>{
      const getOrdersForAdmin=async ()=>{
        setIsLoading(true);
        try{
          const response= await api.get<responseType>(`api/Admin/getorders/${selectedStatus}`);
          if(response.status===HttpStatusCode.Ok)
          {
            setOrdersList(response.data.data);
            setIsLoading(false);
          }
          

        }catch(error){

          if (axios.isAxiosError(error)) {
        const responseData: responseType = error.response?.data;

        if (error.code === "ERR_NETWORK") {
          setIsLoading(false);
          setIsError(true);
        }
        
        if (error.status === HttpStatusCode.BadRequest) {
          toast.error(responseData.message);
          
        }
      }

        }


      }
      
      getOrdersForAdmin();

      
      

      

    },[selectedStatus]);

    useEffect(()=>{
      const refreshToken=async()=>{
        try {
        const response = await api.post<refreshTokenResponseType>(
          "/api/Authentication/refreshtoken"
        );

        if (response.status === HttpStatusCode.Ok) {
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          
          
          await connection.start();
        }
      } catch (refreshError) {

        if (axios.isAxiosError(refreshError) && refreshError.response) {
          const responseData: refreshTokenResponseType =
            refreshError.response.data;

          if (
            refreshError.response.status === HttpStatusCode.BadRequest 
          ) {
            const msg = responseData.message;

            if (msg === "Please login in order to get the tokens.") {
              navigate("/login");
              
            } else if (msg === "Please verify your email first.") {
              navigate("/error");
            } else if (msg === "Your account has been disabled.") {
              navigate(`/error?errorCode=503&message=${encodeURIComponent(msg)}`);
            } else if (msg === "Sign up to access the services.") {
              navigate("/signup");
            }
          }
        }
        
      }
    };
      const connection:HubConnection=new HubConnectionBuilder().withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/admin`,{
        accessTokenFactory:()=>{
          const accessToken=localStorage.getItem("accessToken");
          return accessToken? accessToken:"";

        }
      }).withAutomaticReconnect().build();
      
      connection.on("NewPendingOrder",(order:orderType)=>{
        if(selectedStatus==="Pending")
        {
          setOrdersList((prevOrdList:orderType[]):orderType[]=>{
          return [...prevOrdList,order];

        });
          
        }
        

      });
      const startWebSocketConnection=async()=>{
        try{
        await connection.start();

      }catch(error){
        
        const statusCode=(error as {statusCode?:number}).statusCode;
        if(statusCode===401){
          console.log("errrrrrrrror");
          refreshToken();
          

        }

      };

      }
      startWebSocketConnection();
      
      return()=>{
        connection.stop();
      };

    },[])

      

    return(
        <div style={{ width: "100vw", height: "100vh" }}>
      <ErrorScreen1 isError={isError}></ErrorScreen1>
       <LoadingScreen1 isLoading={isLoading}></LoadingScreen1>
       <Toaster position="top-center" closeButton={true} />
      <div
        style={{
          
            display: isLoading|| isError?"none":"flex",
        }}
        className={styles.background}
      >
        <AdminOrderPageHeader ordersCount={ordersList.length??0} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}></AdminOrderPageHeader>
        <AdminOderPageOrdersContainer setIsloading={setIsLoading} setIsError={setIsError} setOrdersList={setOrdersList} orderList={ordersList} selectedStatus={selectedStatus}></AdminOderPageOrdersContainer>
      </div>
    </div>
        
    )


}
export default AdminOrderPage;