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
  usesQuantityInNumber,
  invoiceNo,
  dcNo,
}) => {

  const signupValuesNtnCnic = signupValues?.NTNCNIC?.toString();

  const postFbrApiUrl = import.meta.env.VITE_API_URL_FBR_SALES_URL;
  const postLocalApiUrl = `${import.meta.env.VITE_API_URL}saleinvoice`;
  const { registerUser: postFbrInvoice, loading: fbrLoading } =
    usePostFbr(postFbrApiUrl);
  const { registerUser: postLocalInvoice, loading: localLoading } =
    usePostApi(postLocalApiUrl);
  const loading = fbrLoading || localLoading;

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
    const commonPayload = {
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
    };

    const removeQuantityInNumber = (item) => {
      const cleanedItem = { ...item };
      delete cleanedItem.quantityInNumber;
      return cleanedItem;
    };

    // FBR accepts Product Quantity only.
    const fbrItems = submitInvoiceData.map(removeQuantityInNumber);
    const fbrPayload = { ...commonPayload, items: fbrItems };

    const fbrResponse = await postFbrInvoice(fbrPayload, {
      Authorization: `Bearer ${signupValues?.FBRToken}`,
    });

    if (fbrResponse?.error) {
      Swal.fire({
        icon: "error",
        title: "FBR submission failed",
        text:
          typeof fbrResponse.error === "string"
            ? fbrResponse.error
            : fbrResponse.error?.message || "Something went wrong",
      });
      return;
    }

    const validationResponse = fbrResponse?.validationResponse;
    if (validationResponse?.statusCode !== "00") {
      const itemErrors = validationResponse?.invoiceStatuses
        ?.map((status) => `Item ${status.itemSNo}: ${status.error}`)
        .join("\n");

      Swal.fire({
        icon: "error",
        title: "FBR submission failed",
        text:
          validationResponse?.error ||
          itemErrors ||
          "FBR did not accept the invoice",
      });
      return;
    }

    // Only the designated seller stores both quantity fields locally.
    const localItems = submitInvoiceData.map((item, index) => {
      const localItem = {
        ...item,
        poNumber: getProductsData[index]?.poNumber ?? "",
      };

      if (usesQuantityInNumber) {
        localItem.quantityInNumber = Number(
          getProductsData[index]?.quantityInNumber ?? 0,
        );
        return localItem;
      }

      return removeQuantityInNumber(localItem);
    });

    const localApiPayload = {
      ...commonPayload,
      invoiceNo,
      dcNo,
      items: localItems,
      FBRToken: signupValues?.FBRToken,
      fbrResponse: fbrResponse?.invoiceNumber,
      fbrResponseDate: fbrResponse?.dated,
      grandTotal,
    };

    const localResponse = await postLocalInvoice(localApiPayload);

    if (localResponse?.error || localResponse?.status === false) {
      Swal.fire({
        icon: "error",
        title: "Local save failed",
        text:
          localResponse?.message ||
          (typeof localResponse?.error === "string"
            ? localResponse.error
            : localResponse?.error?.message) ||
          "The invoice was accepted by FBR but could not be saved locally",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Invoice submitted to FBR and saved locally successfully",
    });
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
        quantityInNumber,
      } = item;

      const qty = Number(productQty) || 0;
      const numericQuantity = Number(quantityInNumber) || 0;
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
        valueExcludingST = (usesQuantityInNumber ? numericQuantity : qty) * price;
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
        quantityInNumber: numericQuantity,
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
  }, [buyerValues?.customertype, getProductsData, usesQuantityInNumber]);


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
                  {usesQuantityInNumber && <th>Quantity in Numbers</th>}
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
                    {usesQuantityInNumber && <td>{item.quantityInNumber}</td>}
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
