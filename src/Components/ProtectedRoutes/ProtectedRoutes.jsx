import { Outlet, Navigate } from "react-router-dom";
import Menu from "./Navbar/Menu";
import Footer from "./Footer/Footer";
import Spinner from "../utils/Spinner/Spinner";
import { useSelector } from "react-redux";
const ProtectedRoutes = () => {
    const { loginVal, loading } = useSelector((state) => state.submitStore);

    if (loading) return <Spinner />;

    return loginVal ? (
        <>
            <Menu />
            <Outlet />
            <Footer />
        </>
    ) : (
        <Navigate to="/" />
    );
}

export default ProtectedRoutes


