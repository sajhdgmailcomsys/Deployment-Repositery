import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './MainWebsitePages/HomePage/Home.tsx';
import ProductPage from './MainWebsitePages/ProductDetailPage/ProductPage.tsx';
import SearchPage from './MainWebsitePages/SearchPage/SearchPage.tsx';
import OrderHistory from './MainWebsitePages/OrderHistory/OrderHistory.tsx';
import SearchResult from './MainWebsitePages/SearchResult/SearchResult.tsx';
import SetContactDetails from './AuthenticationPages/SetContactDetailsPage/SetContactDetails.tsx';
import Cart from './MainWebsitePages/Cart/Cart.tsx';
import Login from './AuthenticationPages/LoginPage/Login.tsx';
import Signup from './AuthenticationPages/SignupPage/Signup.tsx';
import ChangePasswordForm from './AuthenticationPages/ChangePasswordFormPage/ChangePasswordForm.tsx';
import CheckChangePasswordToken from './AuthenticationPages/CheckChangePasswordTokenPage/CheckChangePasswordToken.tsx';
import EmailNotVerifiedYetForm from './AuthenticationPages/EmailNotVerifiedYetFormPage/EmailNotVerifiedYetForm.tsx';
import CheckVerifyEmailToken from './AuthenticationPages/CheckVerifyEmailTokenPage/CheckVerifyEmailToken.tsx';
import ErrorPage from './ErrorPages/ErrorPage.tsx';
import AdminOrderPage from './AdminPages/AdminOrderPage/AdminOrderPage.tsx';
import SingleOrderDetailsPage from './MainWebsitePages/SingleUserOrderDetailsPage/SingleOrderDetailsPage.tsx';
import AdminAddProductPage from './AdminPages/AdminProductManagementPages/AdminAddProductPage.tsx';
import AdminUpdateProductPriceOrStock from './AdminPages/AdminProductManagementPages/AdminUpdateProductPriceOrStockPage.tsx';
import AdminAddNewCategoryOrBrandPage from './AdminPages/AdminProductManagementPages/AdminAddNewCategoryOrBrandPage.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/cart' element={<Cart />}></Route>
            <Route path="/changepasswordform" element={<ChangePasswordForm />}></Route>
            <Route path="/EmailNotVerifiedYetForm" element={<EmailNotVerifiedYetForm />}></Route>
            <Route path="/checkchangepasswordtoken" element={<CheckChangePasswordToken />}></Route>
            <Route path="/error" element={<ErrorPage />}></Route>
            <Route path="/checkverifyemailtoken" element={<CheckVerifyEmailToken />}></Route>
            <Route path="/product" element={<ProductPage />}></Route>
            <Route path="/searchpage" element={<SearchPage />}></Route>
            <Route path="/orderhistory" element={<OrderHistory />}></Route>
            <Route path="/searchresult" element={<SearchResult />}></Route>
            <Route path="/Setcontactdetails" element={<SetContactDetails />}></Route>
            <Route path="/adminorderpage" element={<AdminOrderPage />}></Route>
            <Route path="/singleorderdetails" element={<SingleOrderDetailsPage />}></Route>
            <Route path="/adminaddnewproduct" element={<AdminAddProductPage />}></Route>
            <Route path="/adminupdateproductpriceorstock" element={<AdminUpdateProductPriceOrStock />}></Route>
            <Route path='/adminaddnewcategoryorbrand' element={<AdminAddNewCategoryOrBrandPage />}></Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
