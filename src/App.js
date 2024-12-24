import './App.css';
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminLayout from './layout/adminLayout/AdminLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './pages/admin/user/user';
import { ToastContainer } from 'react-toastify';
import BookManager from '../src/pages/admin/BookManager/BookManager';
import { CategoryProvider } from './contexts/CategoryContext';
import Error500 from './pages/error/Error500';
import CategoryManager from './pages/admin/CategoryManager/CategoryManager';
import LanguageManager from './pages/admin/languageManager/languageManager';
import BookCoverTypeManager from './pages/admin/bookCoverTypeManager/bookCoverTypeManager';
import SupplierManager from './pages/admin/supplier/supplierManager';
import { RoleProvider } from './contexts/roleContext';
import UserManagement from './pages/userManagement/userManagement';
import SupplierManagement from './pages/admin/supplierBook/supplierBookManagement';
import { ClientContextProvider } from './contexts/CientContext';
import ClientLayout from './layout/clientLayout/ClientLayout';
import Banner from './layout/banner/banner';
import AuthPage from './pages/client/authClientPage';
import HomePage from './pages/client/trangChu/trangChu';
import BookDetail from './components/bookClient/bookDetail';
import { CartProvider } from './contexts/CartContext';
import CartPage from './pages/cartAndOrder/cartAndOrder';
import CategoryPage from './pages/client/bookByCateGory/bookBycategoty';
import ResultCheckoutPage from './pages/ResultCheckoutPage/ResultCheckoutPage';
import MyOrders from './pages/myOrders/myOrder';
import AccountInfo from './pages/myAccountInfor/MyAccountInfor';
import ChangePassword from './pages/myAccountInfor/ChangPassword';
import SidebarUser1 from './layout/userLayout/SidebarUser1';
import OrdersByPhoneNumber from './pages/myOrders/searchOrderByPhoneNumber';
import AdminOrderForm from './components/adminOrder/adminOrder';
import OrdersManagement from './pages/admin/orderManagement/ordermanagement';
import THongKe3 from './pages/admin/staititis/thongke3';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (
        <div className="App">
            <Router>
            <ToastContainer
                style={{ zIndex: 100000000 }}
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
            />
                <Routes>
                    <Route path="/error" element={<Error500 />} />
                    <Route path="/admin" element={<AdminLogin />}></Route>

                    {/* Route cho các trang quản trị */}
                    <Route
                        path="/*"
                        element={
                            <ClientContextProvider>
                                <CartProvider>
                                    <ClientLayout>
                                        <Routes>
                                            <Route path="/" element={<HomePage />} />
                                            <Route path="/resultcheckout" element={<ResultCheckoutPage />} />
                                            <Route path="/search" element={<CategoryPage />} />
                                            <Route path="/book/:bookId" element={<BookDetail />} />
                                            <Route path="auth" element={<AuthPage />} />
                                            <Route path="cart" element={<CartPage />} />{' '}
                                            <Route path="orderbyphonenumber" element={<OrdersByPhoneNumber />} />
                                            <Route
                                                path="/myaccount/*"
                                                element={
                                                    <div style={{ display: 'flex' }}>
                                                        <SidebarUser1 />
                                                        <div style={{ flex: 1, padding: '20px' }}>
                                                            <Routes>
                                                                <Route path="order" element={<MyOrders />} />
                                                                <Route path="accountinfo" element={<AccountInfo />} />
                                                                <Route
                                                                    path="changepassword"
                                                                    element={<ChangePassword />}
                                                                />
                                                            </Routes>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </Routes>
                                    </ClientLayout>
                                </CartProvider>
                            </ClientContextProvider>
                        }
                    />
                    <Route path="test2" element={<Banner />} />
                    <Route
                        path="/admin/*"
                        element={
                            <AdminLayout>
                                <Routes>
                                {/* <Route path="thongke" element={<Statitis />} />
                                <Route path="thongke2" element={<Statistics2 />} /> */}
                                <Route path="dashboard" element={<THongKe3 />} />
                                    <Route path="users" element={<Users />} />
                                    <Route
                                        path="product"
                                        element={
                                            <CategoryProvider>
                                                <BookManager />
                                            </CategoryProvider>
                                        }
                                    />
                                    <Route path="category" element={<CategoryManager />} />
                                    <Route path="language" element={<LanguageManager />} />
                                    <Route path="bookcovertype" element={<BookCoverTypeManager />} />
                                    <Route path="supplier" element={<SupplierManager />} />
                                    <Route path="order" element={<OrdersManagement />} />
                                    <Route path="order/add" element={<AdminOrderForm />} />
                                    <Route
                                        path="user"
                                        element={
                                            <RoleProvider>
                                                <UserManagement />
                                            </RoleProvider>
                                        }
                                    />
                                    <Route
                                        path="supplierbook"
                                        element={
                                            <CategoryProvider>
                                                <SupplierManagement />
                                            </CategoryProvider>
                                        }
                                    />

                                    {/* Thêm các route quản trị khác tại đây */}
                                </Routes>
                            </AdminLayout>
                        }
                    />
                </Routes>
            </Router>
  
        </div>
    );
}

export default App;
