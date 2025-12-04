import { MdModeEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePostFbr } from "../../../customhooks/usePostFbr";
import Spinner from "../../utils/Spinner/Spinner";
import Swal from "sweetalert2";

const SalesInvoice = ({
  getProductsData,
  setGetProductsData,
  onEdit,
  date,
  signupValues,
  buyerValues,
  selectedScenarioId,
}) => {

  const signupValuesNtnCnic = signupValues?.NTNCNIC?.toString();

  const postFbrApiUrl = import.meta.env.VITE_API_URL_FBR_SALES_URL;
  const postLocalApiUrl = `${import.meta.env.VITE_API_URL}saleinvoice`;

  const { registerUser: postFbrInvoice, data, loading } = usePostFbr(postFbrApiUrl);
  const { registerUser: postLocalInvoice } = usePostApi(postLocalApiUrl);

  const [grandTotal, setGrandTotal] = useState(0);
  const [submitInvoiceData, setSubmitInvoiceData] = useState([]);

  const delInvoiceItem = (id) => {
    const updated = getProductsData.filter((_, index) => index !== id);
    setGetProductsData(updated);
  };

  const editInvoiceItem = (id) => {
    const item = getProductsData.find((_, index) => index === id);
    onEdit(item, id);
  };

  const submitInvoice = async () => {
    await postFbrInvoice(
      {
        invoiceType: "Sale Invoice",
        invoiceDate: date,
        sellerNTNCNIC: signupValuesNtnCnic,
        sellerBusinessName: signupValues?.BusinessName,
        sellerProvince: signupValues?.Province,
        sellerAddress: signupValues?.Address,
        buyerNTNCNIC: buyerValues?.ntnCnic,
        buyerBusinessName: buyerValues?.name,
        buyerProvince: buyerValues?.province,
        buyerAddress: buyerValues?.address,
        buyerRegistrationType: buyerValues?.customertype,
        invoiceRefNo: "",
        scenarioId: selectedScenarioId,
        items: submitInvoiceData,
      },
      { Authorization: `Bearer ${signupValues?.FBRToken}` }
    );
  };

  useEffect(() => {
    if (!getProductsData || getProductsData.length === 0) {
      setSubmitInvoiceData([]);
      setGrandTotal(0);
      return;
    }

    const newSubmitData = getProductsData.map((item) => {
      const {
        hsCode,
        productValue,
        uom,
        taxType,
        productQty,
        productPrice,
        furtherTax,
        sroScheduleNo,
        sroItemSerialNo,
        fixedNotifiedValueOrRetailPrice,
        salesTaxWithheldAtSource,
        extraTax,
      } = item;

      const qty = Number(productQty) || 0;
      const price = Number(productPrice) || 0;

      let valueExcludingST = 0;
      let salesTaxApplicable = 0;
      let furtherTaxValue = 0;
      let totalValues = 0;

      if (taxType.saleType === "3rd Schedule Goods") {
        valueExcludingST = qty * price;

        const fnv = Number(fixedNotifiedValueOrRetailPrice || 0);
        salesTaxApplicable = fnv * 0.18;

        if (buyerValues?.customertype === "Unregistered" && furtherTax) {
          furtherTaxValue = fixedNotifiedValueOrRetailPrice * (Number(furtherTax) / 100);
        } else {
          furtherTaxValue = 0;
        }
        totalValues = salesTaxApplicable + furtherTaxValue + fixedNotifiedValueOrRetailPrice;
      }

      else {
        valueExcludingST = qty * price;
        salesTaxApplicable = valueExcludingST * (taxType.salesTaxValue / 100);

        if (buyerValues?.customertype === "Unregistered" && furtherTax) {
          furtherTaxValue = valueExcludingST * (Number(furtherTax) / 100);
        }

        totalValues = valueExcludingST + salesTaxApplicable + furtherTaxValue;
      }

      return {
        hsCode,
        productDescription: productValue,
        uoM: uom,
        rate: `${taxType.salesTaxValue}%`,
        saleType: taxType.saleType,

        quantity: qty,
        price: price,

        valueSalesExcludingST: Number(valueExcludingST.toFixed(2)),
        salesTaxApplicable: Number(salesTaxApplicable.toFixed(2)),
        furtherTax: Number(furtherTaxValue.toFixed(2)),
        totalValues: Number(totalValues.toFixed(2)),

        sroItemSerialNo: sroItemSerialNo ?? "",
        sroScheduleNo: sroScheduleNo ?? "",

        // Send FNV only for 3rd schedule goods
        fixedNotifiedValueOrRetailPrice:
          taxType.saleType === "3rd Schedule Goods"
            ? Number(fixedNotifiedValueOrRetailPrice || 0)
            : 0,

        salesTaxWithheldAtSource: Number(salesTaxWithheldAtSource ?? 0),
        extraTax: extraTax ?? "",
        fedPayable: 0,
        discount: 0,
      };
    });

    setSubmitInvoiceData(newSubmitData);

    // CORRECT GRAND TOTAL (only from transformed values)
    const total = newSubmitData.reduce(
      (acc, item) => acc + Number(item.totalValues),
      0
    );

    setGrandTotal(Number(total.toFixed(2)));
  }, [getProductsData]);


  useEffect(() => {
    const submitToLocalApi = async () => {
      const vr = data?.validationResponse;
      if (!vr) return;

      const arrayError = vr?.invoiceStatuses?.length
        ? vr.invoiceStatuses.map((s) => `Item ${s.itemSNo}: ${s.error}`).join("\n")
        : null;

      const finalError = vr?.error || arrayError || "Something went wrong";

      if (vr.statusCode === "01") {
        Swal.fire({ icon: "error", title: "Error", text: finalError });
        return;
      }

      if (vr.statusCode === "00") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Invoice sent to FBR portal successfully",
        });

        const localRes = await postLocalInvoice({
          invoiceType: "Sale Invoice",
          invoiceDate: date,
          sellerNTNCNIC: signupValuesNtnCnic,
          sellerBusinessName: signupValues?.BusinessName,
          sellerProvince: signupValues?.Province,
          sellerAddress: signupValues?.Address,

          buyerNTNCNIC: buyerValues?.ntnCnic,
          buyerBusinessName: buyerValues?.name,
          buyerProvince: buyerValues?.province,
          buyerAddress: buyerValues?.address,
          buyerRegistrationType: buyerValues?.customertype,

          invoiceRefNo: "",
          scenarioId: selectedScenarioId,
          items: submitInvoiceData,
          FBRToken: signupValues?.FBRToken,
          fbrResponse: data?.invoiceNumber,
          fbrResponseDate: data?.dated,
          grandTotal,
        });

        Swal.fire({
          icon: localRes?.status ? "success" : "error",
          title: localRes?.status ? "Saved" : "Error",
          text: localRes?.status
            ? localRes.message
            : localRes?.message || "Failed to save invoice locally",
        });
      }
    };

    submitToLocalApi();
  }, [data]);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container-fluid py-4">
          <h2 className="page-title mb-3" style={{ color: "#E0E7E9" }}>
            Invoice Items
          </h2>

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
                {submitInvoiceData?.map((item, id) => (
                  <tr key={id} style={{ backgroundColor: "#e6f2f7" }}>
                    <th>{id + 1}</th>
                    <td>{item.hsCode}</td>
                    <td>{item.productDescription}</td>
                    <td>{item.uoM}</td>
                    <td>{item.saleType}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.rate}</td>
                    <td>{item.furtherTax}</td>
                    <td>{item.valueSalesExcludingST}</td>
                    <td>{item.totalValues}</td>

                    <td className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => editInvoiceItem(id)}
                        className="btn btn-sm me-2"
                        style={{ background: "#0A5275", color: "white" }}
                      >
                        <MdModeEdit /> Edit
                      </button>

                      <button
                        onClick={() => delInvoiceItem(id)}
                        className="btn btn-sm btn-danger"
                      >
                        <MdDelete /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
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
      )}
    </>
  );
};

export default SalesInvoice;
