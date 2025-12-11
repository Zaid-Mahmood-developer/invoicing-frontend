import { useState, useEffect, React } from "react";
import { MdModeEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { usePostFbr } from "../../../customhooks/usePostFbr";
import Spinner from "../../utils/Spinner/Spinner";
const CreditNote = () => {
  const postlocalUrl = `${import.meta.env.VITE_API_URL}credit-note`;
  const postFbrUrl = `${import.meta.env.VITE_API_URL_FBR_SALES_URL}`;
  const { registerUser: postFbrData, data: fbrData, error: fbrError, loading } = usePostFbr(postFbrUrl);
  const { registerUser: postData, data: localData, error: localError, loading: localLoading } = usePostFbr(postlocalUrl);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const location = useLocation();
  const { data, invoiceId } = location.state || {};

  const [editIndex, setEditIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const findSpecificInvoice = data?.recentInvoices.find(inv => inv._id === invoiceId);
  console.log(findSpecificInvoice , "findRef")
  const startEdit = (index) => {
    setEditIndex(index);
    setEditQuantity(items[index].quantity); // show positive qty for editing
  };

  const saveEdit = (index) => {
    const originalQ = findSpecificInvoice.items[index].quantity;

    if (editQuantity > originalQ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: `Quantity cannot exceed the original (${originalQ})`
      });
      return;
    }

    const updated = [...items];
    const old = updated[index];

    const negativeQty = (editQuantity);

    const valueExTax = old.price * negativeQty;
    const salesTaxVal = (parseFloat(old.rate) / 100) * (old.price * negativeQty);
    const furtherTaxVal = old.furtherTax * negativeQty;

    updated[index] = {
      ...old,
      quantity: negativeQty,
      valueSalesExcludingST: valueExTax,
      salesTaxApplicable: salesTaxVal,
      totalValues: valueExTax + salesTaxVal + furtherTaxVal,
    };

    setItems(updated);
    setEditIndex(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
  };

  useEffect(() => {
    if (findSpecificInvoice) {
      const convertedItems = findSpecificInvoice.items.map(item => {
        const negativeQty = (item.quantity);

        const valueExTax = item.price * negativeQty;
        const salesTaxVal = (parseFloat(item.rate) / 100) * (item.price * negativeQty);
        const furtherTaxVal = item.furtherTax * negativeQty;

        return {
          ...item,
          quantity: negativeQty,
          valueSalesExcludingST: valueExTax,
          salesTaxApplicable: salesTaxVal,
          totalValues: valueExTax + salesTaxVal + furtherTaxVal,
        };
      });

      setItems(convertedItems);
    }
  }, [findSpecificInvoice]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + Number(item.totalValues || 0), 0);
    setGrandTotal(total);
  }, [items]);

  const submitInvoice =  () => {
    const submitData = {
      invoiceType: "Credit Note",
      invoiceDate: date,
      sellerNTNCNIC: findSpecificInvoice.sellerNTNCNIC,
      sellerBusinessName: findSpecificInvoice.sellerBusinessName,
      sellerProvince: findSpecificInvoice.sellerProvince,
      sellerAddress: findSpecificInvoice.sellerAddress,

      buyerNTNCNIC: findSpecificInvoice.buyerNTNCNIC,
      buyerBusinessName: findSpecificInvoice.buyerBusinessName,
      buyerProvince: findSpecificInvoice.buyerProvince,
      buyerAddress: findSpecificInvoice.buyerAddress,
      buyerRegistrationType: findSpecificInvoice.buyerRegistrationType,
      scenarioId: findSpecificInvoice.scenarioId,
      invoiceRefNo: findSpecificInvoice.fbrResponse,
      FBRToken: findSpecificInvoice.FBRToken,
      items: items,
      grandTotal: grandTotal,
    };
    console.log(submitData, "submitReturnData")
    // await postFbrData((submitData),
    //   { Authorization: `Bearer ${findSpecificInvoice?.FBRToken}` }
    // );
  }

  // useEffect(() => {
  //   const submitToLocalApi = async () => {
  //     const vr = fbrData?.validationResponse;
  //     if (!vr) return;
  //     const arrayError = vr?.invoiceStatuses?.length
  //       ? vr.invoiceStatuses.map((s) => `Item ${s.itemSNo}: ${s.error}`).join("\n")
  //       : null;

  //     const finalError = vr?.error || arrayError || "Something went wrong";
  //     if (vr.statusCode === "01") {
  //       Swal.fire({ icon: "error", title: "Error", text: finalError });
  //       return;
  //     }

  //     if (vr.statusCode === "00") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Invoice sent to FBR portal successfully",
  //       });
  //       const localSubmitData = {
  //         ...submitData
  //       };
  //       await postData(localSubmitData);
  //       Swal.fire({
  //         icon: fbrError ? "error" : "success",
  //         title: fbrError ? "Error" : "Success",
  //         text: fbrError ? fbrError.message : "Invoice saved locally successfully",
  //       });
  //     }

  //   }
  //   submitToLocalApi();
  // }, [fbrData]);
  
  return (
    <>
      { loading || localLoading ? (
        <Spinner />
      )
        :

        <div
          className="container-fluid p-4 main-dashboard h-100"
          style={{
            background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
          }}
        >
          <h2 className="page-title mb-2" style={{ color: "#E0E7E9" }}>
            🧾 FBR Credit Note
          </h2>

          {/* Seller Info */}
          <div className="seller-buyer-wrapper">
            <div className="my-4">
              <div
                className="card px-4"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                }}
              >
                <div className="d-flex justify-content-between">
                  <h2 className="my-2" style={{ color: "#0A5275" }}>
                    Seller Information
                  </h2>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className="w-25 border-2 rounded-pill px-4 mt-2 borderClass2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      borderColor: "#0A5275",
                      backgroundColor: "#E0E7E9",
                      color: "#0A5275",
                    }}
                  />
                </div>

                <div className="d-flex">
                  <div className="headingWidth" style={{ color: "#0A5275" }}>
                    <p><strong>Business Name</strong></p>
                    <p><strong>NTN/CNIC</strong></p>
                    <p><strong>Address</strong></p>
                    <p><strong>Province</strong></p>
                  </div>

                  <div style={{ color: "#0A5275" }}>
                    <p><strong>{findSpecificInvoice?.sellerBusinessName}</strong></p>
                    <p><strong>{findSpecificInvoice?.sellerNTNCNIC}</strong></p>
                    <p><strong>{findSpecificInvoice?.sellerAddress}</strong></p>
                    <p><strong>{findSpecificInvoice?.sellerProvince}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            <div className="my-4">
              <div
                className="card px-4"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  color: "#0A5275",
                  marginBottom: "15px",
                }}
              >
                <h2 className="my-2">Buyer Information</h2>

                <div className="d-flex align-items-center" style={{ marginBottom: "10px" }}>
                  <label className="form-label w-25 fw-bold">Business Name</label>
                  <input
                    className="form-control p-2"
                    value={findSpecificInvoice?.buyerBusinessName || ""}
                    style={{
                      borderColor: "#0A5275",
                      backgroundColor: "#d9edf2",
                      color: "#0A5275",
                    }}
                    readOnly
                  />
                </div>

                <div className="d-flex align-items-center">
                  <div className="headingWidth">
                    <p><strong>NTN/CNIC</strong></p>
                    <p><strong>Address</strong></p>
                    <p><strong>Province</strong></p>
                    <p><strong>Customer Type</strong></p>
                  </div>

                  <div className="headingValues my-2">
                    <p><strong>{findSpecificInvoice?.buyerNTNCNIC}</strong></p>
                    <p><strong>{findSpecificInvoice?.buyerBusinessName}</strong></p>
                    <p><strong>{findSpecificInvoice?.buyerProvince}</strong></p>
                    <p><strong>{findSpecificInvoice?.buyerRegistrationType}</strong></p>
                  </div>
                </div>

                <div className="d-flex align-items-center pb-1">
                  <label className="form-label w-25 fw-bold">Scenario Id</label>
                  <input
                    className="form-control p-2"
                    value={findSpecificInvoice?.scenarioId || ""}
                    style={{
                      borderColor: "#0A5275",
                      backgroundColor: "#d9edf2",
                      color: "#0A5275",
                    }}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div
              className="table-responsive shadow-lg rounded-4 p-3 mt-4"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(6px)",
              }}
            >
              <table className="table table-hover text-center">
                <thead style={{ backgroundColor: "#0A5275", color: "#fff" }}>
                  <tr>
                    <th>Sr.No.</th>
                    <th>HS Code</th>
                    <th>Product Name</th>
                    <th>UOM</th>
                    <th>Tax Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Sales Tax</th>
                    <th>Further Tax</th>
                    <th>Value (Ex-Tax)</th>
                    <th>Value (All Taxes)</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, id) => {
                    const originalQ = findSpecificInvoice.items[id].quantity;

                    return (
                      <tr key={id} style={{ backgroundColor: "#e6f2f7" }}>
                        <th>{id + 1}</th>
                        <td>{item.hsCode}</td>
                        <td>{item.productDescription}</td>
                        <td>{item.uoM}</td>
                        <td>{item.saleType}</td>

                        <td>
                          {editIndex === id ? (
                            <input
                              type="number"
                              className="form-control"
                              value={editQuantity}
                              min={0}
                              max={originalQ}
                              onChange={(e) => setEditQuantity(Number(e.target.value))}
                              style={{ width: "80px" }}
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>

                        <td>{item.price}</td>
                        <td>{item.rate}</td>
                        <td>{item.furtherTax}</td>
                        <td>{item.valueSalesExcludingST}</td>
                        <td>{item.totalValues}</td>

                        <td className="d-flex justify-content-center gap-2">
                          {editIndex === id ? (
                            <>
                              <button onClick={() => saveEdit(id)} className="btn btn-sm btn-success">
                                Save
                              </button>
                              <button onClick={cancelEdit} className="btn btn-sm btn-secondary">
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEdit(id)}
                              className="btn btn-sm me-2"
                              style={{ background: "#0A5275", color: "white" }}
                            >
                              <MdModeEdit /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end my-4">
              <p
                className="p-3 fw-bold"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "8px",
                }}
              >
                Grand Total: {grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              onClick={submitInvoice}
              className="btn"
              style={{
                backgroundColor: "#0A5275",
                color: "#fff",
                padding: "10px 25px",
                borderRadius: "8px",
              }}
            >
              Submit Invoice
            </button>
          </div>
        </div>
   

      }
    </>
  );
};

export default CreditNote;
