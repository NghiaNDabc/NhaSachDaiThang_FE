import { ToastContainer } from "react-toastify";

function ToastCustom() {
    return (
        <ToastContainer style={{ zIndex: 100000000 }} position="top-right" autoClose={4000} hideProgressBar={false} />
    );
}

export default ToastCustom;
