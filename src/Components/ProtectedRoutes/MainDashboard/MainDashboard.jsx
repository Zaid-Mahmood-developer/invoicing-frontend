import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { todayTile, monthTile } from "./dummyUtils";
import { useGetApi } from "../../../customhooks/useGetApi";
import InvoicePdf from "../../Invoices/InvoicePdf";
import Spinner from "../../utils/Spinner/Spinner"
const MainDashboard = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const handlePrint = (fbrId, data) => {
        const findData = data?.recentInvoices.find(inv => inv._id === fbrId);
        setInvoiceData(findData);

        setTimeout(() => {
            const invoiceEl = document.getElementById("invoice");
            if (!invoiceEl) {
                console.error("Invoice html not found");
                return;
            }

            const html = invoiceEl.innerHTML;
            const printWindow = window.open("", "_blank");

            printWindow.document.write(`
            <html>
            <head><title>Invoice</title></head>
            <body>${html}
                <script>window.onload = () => window.print();<\/script>
            </body>
            </html>
        `);

            printWindow.document.close();
        }, 300); // wait for InvoicePdf to render
    };
    const getUrl = `${import.meta.env.VITE_API_URL}dashboard`;
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const { data, loading, error, fetchData } = useGetApi(getUrl);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        } else if (data) {
            setDashboardData(data.data);
        }
    }, [data, error]);

    const getValue = (path) =>
        path.split(".").reduce((obj, key) => obj?.[key], dashboardData);

    const navigateFunc = (invoiceId , data) => {
        navigate("/creditnote" , {
            state:{invoiceId , data}
        });
    };

    return (
        <>
        {loading ?
        <Spinner />
    :
         <div
            className="container-fluid main-dashboard vh-100 p-4"
            style={{
                background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
                padding: "20px",
            }}
        >
            {/* Welcome Card */}
            <div
                className="container-bg p-4 borderClass w-100"
                style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "15px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    color: "#0A5275",
                }}
            >
                <p className="mb-0">
                    Welcome,{" "}
                    <span className="fw-bold">
                        {dashboardData?.recentInvoices[0]?.sellerBusinessName || "User"}
                    </span>
                </p>
            </div>

            {/* Tiles */}
            <div className="mainTileWrapper d-flex justify-content-between mt-4 flex-wrap gap-4">
                {[...todayTile, ...monthTile].map((item, id) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={id}
                            className="tileWrapper p-4 borderClass"
                            style={{
                                background: "linear-gradient(135deg, #0A5275, #00a8cc)",
                                color: "#fff",
                                borderRadius: "15px",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                                minWidth: "220px",
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="me-4">
                                    <Icon className="fs-2" />
                                </div>
                                <div>
                                    <h5 className="mb-0">{item.title}</h5>
                                    <h3 className="mb-0">
                                        {getValue(item.key) !== undefined
                                            ? Number(getValue(item.key)).toFixed(2)
                                            : "0"}
                                    </h3>
                                    <p className="mb-0">{item.currentTime}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sales Table */}
            <div className="salesBreakdown mt-4">
                <h3 className="py-4" style={{ color: "#E0E7E9" }}>
                   Sales Breakdown
                </h3>
                <div
                    className="table-responsive shadow-lg rounded-4 p-3 mt-4"
                    style={{
                        background: "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <table
                        className="table table-hover borderClass text-center"
                        style={{
                            background: "rgba(255,255,255,0.88)",
                            backdropFilter: "blur(6px)",
                            borderRadius: "12px",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                        }}
                    >
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-uppercase">Date</th>
                                <th className="py-2 px-4 text-uppercase">Invoice #</th>
                                <th className="py-2 px-4 text-uppercase">Customer</th>
                                <th className="py-2 px-4 text-uppercase">Qunatity</th>
                                <th className="py-2 px-4 text-uppercase">Price</th>
                                <th className="py-2 px-4 text-uppercase">Sales Tax</th>
                                <th className="py-2 px-4 text-uppercase">Further Tax Amount</th>
                                <th className="py-2 px-4 text-uppercase">Total</th>
                                <th colSpan={2} className="py-2 px-4 text-uppercase">
                                    View
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData?.recentInvoices?.length > 0 ?
                             (
                                dashboardData.recentInvoices.map((invoice, invoiceIndex) => (
                                    invoice.items.map((item, itemIndex) => (
                                        <tr key={`${invoiceIndex}-${itemIndex}`}>
                                            <td>{invoice.invoiceDate}</td>
                                            <td>{invoice.fbrResponse}</td>
                                            <td>{invoice.sellerBusinessName}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.rate}</td>
                                            <td>{item.furtherTax}</td>
                                            <td>{item.totalValues}</td>
                                            <td>
                                                <button onClick={() => handlePrint(invoice._id, dashboardData)} className="btn btn-sm btn-primary">
                                                    View
                                                </button>
                                            </td>

                                            <td>
                                                <button onClick={()=>navigateFunc(invoice._id, dashboardData)} className="btn btn-sm btn-success">
                                                    Credit Note
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ))
                            )
                        :
                        <tr>
                            <td className="fw-bold" colSpan="10">No invoices found.</td>
                        </tr>
                        }
                        </tbody>

                    </table>
                </div>
            </div>
            <div id="invoice" style={{ display: "none" }}>
                <InvoicePdf invoice={invoiceData} />
            </div>
        </div>
    }

        </>
        
    );
};

export default MainDashboard;
