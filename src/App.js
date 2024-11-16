import './App.css';
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminLayout from './layout/adminLayout/AdminLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './pages/admin/user/user';
import { ToastContainer } from 'react-toastify';
import logo from '../src/assets/aa.jpg';
import BookManager from '../src/pages/admin/BookManager/BookManager';
import BookForm2 from './components/bookForm/BookForm2';
import { CategoryProvider } from './contexts/CategoryContext';
import axiosInstance from './api/axiosInstance';
import { useEffect } from 'react';
import Error500 from './pages/error/Error500';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/error" element={<Error500 />} />
                    <Route path="/admin" element={<AdminLogin />}></Route>

                    {/* Route cho các trang quản trị */}
                    <Route
                        path="/admin/*"
                        element={
                            <AdminLayout>
                                <Routes>
                                    <Route path="users" element={<Users />} />
                                    <Route
                                        path="product"
                                        element={
                                            <CategoryProvider>
                                                {' '}
                                                <BookManager />
                                            </CategoryProvider>
                                        }
                                    />
                                    <Route path="test" element={<BookForm2 />} />
                                    {/* Thêm các route quản trị khác tại đây */}
                                </Routes>
                            </AdminLayout>
                        }
                    />
                </Routes>
            </Router>
            <ToastContainer
                style={{ zIndex: 100000000 }}
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
            />
        </div>
    );
}

export default App;
