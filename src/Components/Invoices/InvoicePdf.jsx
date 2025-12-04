import QRCode from "react-qr-code";
import logo from "../../assets/logo/logo-2.png"; 
import fbrLogo from "../../assets/logo/digitalInvoicingSystem-logo.png";

const InvoicePdf = ({ invoice }) => {
    return (
        <div
            id="invoice"
            style={{
                width: "800px",
                margin: "0 auto",
                fontFamily: "Arial",
                padding: "25px",
                color: "#222",
                lineHeight: "1.4",
            }}
        >

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                }}
            >
                {/* LEFT */}
                <div>
                    {/* <img src={logo} width="130" alt="DevOx Syndicate" /> */}
                    <h2 style={{ marginTop: "10px", color: "#0A5275" }}>
                        {invoice?.sellerBusinessName}
                    </h2>
                </div>

                {/* RIGHT */}
                <div style={{ textAlign: "right" }}>
                    <h1 style={{ margin: 0, fontSize: "26px", color: "#0A5275" }}>
                        Invoice # &nbsp; {invoice?.fbrResponse}
                    </h1>

                    <p style={{ margin: "8px 0", fontSize: "13px" }}>
                        <strong>Date:</strong> {invoice?.invoiceDate}<br />
                        <strong>NTN:</strong> {invoice?.sellerNTNCNIC}<br />
                        <strong>Province:</strong> {invoice?.sellerProvince}<br />
                        <strong>Address:</strong> {invoice?.sellerAddress}
                    </p>
                </div>
            </div>

            <hr style={{ border: "0.5px solid #ddd", margin: "20px 0" }} />

            {/* FROM & TO SECTIONS */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "25px",
                    gap: "20px",
                }}
            >
                {/* FROM */}
                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        width: "50%",
                        background: "#f8f9fa",
                        borderRadius: "6px",
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0", color: "#0A5275" }}>From</h3>
                    <p style={{ margin: 0, fontSize: "13px" }}>
                        {invoice?.sellerBusinessName}<br />
                        {invoice?.sellerAddress}<br />
                        NTN/CNIC: {invoice?.sellerNTNCNIC}
                    </p>
                </div>

                {/* TO */}
                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        width: "50%",
                        background: "#f8f9fa",
                        borderRadius: "6px",
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0", color: "#0A5275" }}>To</h3>
                    <p style={{ margin: 0, fontSize: "13px" }}>
                        {invoice?.buyerBusinessName}<br />
                        {invoice?.buyerAddress}<br />
                        NTN/CNIC: {invoice?.buyerNTNCNIC}
                    </p>
                </div>
            </div>

            {/* ITEMS TABLE */}
            <table
                width="100%"
                border="0"
                cellSpacing="0"
                cellPadding="8"
                style={{
                    fontSize: "12px",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                    width: "100%",
                }}
            >
                <thead>
                    <tr style={{ background: "#0A5275", color: "white", textAlign: "left" }}>
                        <th>HS Code</th>
                        <th>Sale Type</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Tax %</th>
                        <th>ST Amount</th>
                        <th>Further Tax</th>
                        <th>Excl. Tax</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {invoice?.items?.map((item, idx) => (
                        <tr
                            key={idx}
                            style={{
                                borderBottom: "1px solid #eee",
                                background: idx % 2 === 0 ? "#fafafa" : "white",
                            }}
                        >
                            <td>{item.hsCode}</td>
                            <td>{item.saleType}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.uoM}</td>
                            <td>{item.rate}</td>
                            <td>{item.salesTaxApplicable}</td>
                            <td>{item.furtherTax}</td>
                            <td>{item.valueSalesExcludingST}</td>
                            <td><strong>{item.totalValues}</strong></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* QR + SUMMARY */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "30px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "90px" }}
                        value={invoice?.fbrResponse || "No Data"}
                        viewBox={`0 0 256 256`}
                    />
                    <img style={{ width: "120px" }} src={fbrLogo} alt="fbr-logo" />
                </div>

                <div
                    style={{
                        fontSize: "16px",
                        padding: "15px 25px",
                        border: "1px solid #ddd",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        textAlign: "right",
                    }}
                >
                    <h2 style={{ margin: 0, color: "#0A5275" }}>
                        Grand Total: {invoice?.grandTotal}
                    </h2>
                </div>
            </div>

            <hr style={{ border: "0.5px solid #ddd", margin: "20px 0" }} />

            {/* FOOTER */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: "12px",
                    marginTop: "10px",
                    color: "#555",
                }}
            >
                <strong>WWW.{invoice?.sellerBusinessName}.PK</strong><br />
                NTN/CNIC: {invoice?.sellerNTNCNIC}
            </div>
        </div>
    );
};

export default InvoicePdf;
