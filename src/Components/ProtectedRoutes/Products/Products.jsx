import { useState, useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Spinner from "../../utils/Spinner/Spinner";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { initialValues, validationSchema, products } from "./dummyUtils";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePutApi } from "../../../customhooks/usePutApi";
import { useDeleteApi } from "../../../customhooks/useDeleteApi";
import { useGetApi } from "../../../customhooks/useGetApi";
const Products = () => {
  const [totalProducts, setTotalProducts] = useState([]);
  const [editMode, setEditMode] = useState({ active: false, id: null });
  const postUrl = `${import.meta.env.VITE_API_URL}products`;
  const currentProductId = editMode.id;
  const putUrl = currentProductId ? `${import.meta.env.VITE_API_URL}products/${currentProductId}` : null;
  const { data: getData, loading: getLoading, error: getError, fetchData } = useGetApi(postUrl);
  const { registerUser, data: postData, loading: postLoading, error: postError } = usePostApi(postUrl);
  const { updateData, data: putData, loading: putLoading, error: putError } = usePutApi(putUrl);
  const { deleteUser, data: delData, loading: delLoading, error: delError } = useDeleteApi();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = { ...values };
      if (editMode.active && currentProductId) {
        await updateData(payload);
      } else {
        await registerUser(payload);
      }
      resetForm();
    },
  });

  const editProduct = (id) => {
    const findProduct = totalProducts.find((item) => item._id === id);
    if (findProduct) {
      formik.setValues(findProduct);
      setEditMode({ active: true, id });
    }
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(`${import.meta.env.VITE_API_URL}products/${id}`)
        
        fetchData();
      }
    });
  };

  const handleHsCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.length > 4) {
      value = value.slice(0, 4) + "." + value.slice(4);
    }
    formik.setFieldValue("hsCode", value);
  };

  useEffect(() => {
    if (postData?.success) {
     
      fetchData();
      Swal.fire("Success", "Product has been added successfully", "success");
    }

    if (postError) {
      Swal.fire("Error", postError?.message || "Something went wrong", "error")
    }

  }, [postData, postError]);

  useEffect(() => {
    if (putData?.success) {
      
      fetchData();
      Swal.fire("Success", "Product has been updated successfully", "success");
      setEditMode({ active: false, id: null });
      formik.resetForm();
    }
    if (putError) {
      Swal.fire("Error", putError?.message || "Something went wrong", "error")
    }
  }, [putData, putError])

  useEffect(() => {
    delData?.message ? Swal.fire("Success", delData?.message, "success") : delError ? Swal.fire("Error", delError?.message, "error") : null;
  }, [delData, delError])

  useEffect(() => {
    if (getData?.success) {
      setTotalProducts(getData?.products);
    }
    if (getError) {
      Swal.fire("Error", getError.message || "Something went wrong", "error");
    }
  }, [getData, getError]);

  
  return (
  <>
  {postLoading || putLoading || delLoading || getLoading ? (
    <Spinner />
  ) : (
    <div
      className="container-fluid p-4 main-dashboard vh-100"
      style={{
        background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
      }}
    >
      {/* GLASS CARD FORM */}
      <div
        className="p-4 shadow-lg rounded-4"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(6px)",
        }}
      >
        <h2 className="fw-bold mb-2" style={{ color: "#0A5275" }}>
          📦 Product Management
        </h2>

        <h3
          style={{
            color: "#0A5275",
            fontWeight: "600",
          }}
        >
          {editMode.active ? "✏️ Edit Product" : "➕ Add Product"}
        </h3>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit}>
          <div className="container">
            <div className="row">
              {products.map((field, idx) => (
                <div className="col-md-4 col-sm-12 mb-3" key={idx}>
                  <label
                    style={{
                      fontWeight: 600,
                      color: "#0A5275",
                    }}
                  >
                    {field.labelName}
                  </label>

                  {/* INPUT BOX */}
                  {(field.type !== "dropdown" &&
                    field.type !== "dropdownUnit") && (
                      <input
                        className={field.inputClass}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formik.values[field.name]}
                        onChange={
                          field.name === "hsCode"
                            ? handleHsCodeChange
                            : formik.handleChange
                        }
                        onBlur={formik.handleBlur}
                        style={{
                          borderColor: "#0A5275",
                          padding: "10px",
                        }}
                      />
                    )}

                  {/* UOM DROPDOWN */}
                  {field.type === "dropdownUnit" && (
                    <select
                      className="form-select"
                      name={field.name}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        borderColor: "#0A5275",
                        padding: "10px",
                      }}
                    >
                      <option value="">
                        Select {field.labelName}
                      </option>
                      {field.options.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Tax Type Dropdown */}
                  {field.type === "dropdown" && (
                    <select
                      className="form-select"
                      name={field.name}
                      value={formik?.values.taxType.descriptionType}
                      onChange={(e) => {
                        const selected =
                          field.options.find(
                            (opt) =>
                              opt.descriptionType === e.target.value
                          ) ||
                          {
                            descriptionType: "",
                            ScenarioId: "",
                            saleType: "",
                            salesTaxValue: "",
                          };

                        formik.setFieldValue("taxType", selected);
                      }}
                      onBlur={formik.handleBlur}
                      style={{
                        borderColor: "#0A5275",
                        padding: "10px",
                      }}
                    >
                      <option value="">
                        Select {field.labelName}
                      </option>
                      {field.options.map((option, i) => (
                        <option key={i} value={option.descriptionType}>
                          {option.descriptionType}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* ERRORS - UNTOUCHED */}
                  {field.type === "dropdown"
                    ? formik.touched.taxType?.descriptionType &&
                      formik.errors.taxType?.descriptionType && (
                        <div className="text-danger small">
                          {formik.errors.taxType.descriptionType}
                        </div>
                      )
                    : formik.touched[field.name] &&
                    formik.errors[field.name] && (
                      <div className="text-danger small">
                        {formik.errors[field.name]}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          {editMode.active ? (
            <button
              type="submit"
              className="btn mt-3"
              style={{
                background: "#0A5275",
                color: "white",
                fontWeight: 600,
              }}
            >
              <RxUpdate className="fs-5" /> Update Product
            </button>
          ) : (
            <button
              type="submit"
              className="btn mt-3"
              style={{
                background: "#0A5275",
                color: "white",
                fontWeight: 600,
              }}
            >
              <IoAddOutline className="fs-4" /> Add Product
            </button>
          )}
        </form>
      </div>

      {/* PRODUCT TABLE */}
      <div
        className="table-responsive shadow-lg rounded-4 p-3 mt-4"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(6px)",
        }}
      >
        <table className="table table-hover text-center">
          <thead style={{ background: "#0A5275", color: "white" }}>
            <tr>
              <th>#</th>
              <th>HS Code</th>
              <th>Product Description</th>
              <th>Unit of Measure</th>
              <th>Tax Type</th>
              <th>Quantity in Hand</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {totalProducts?.map((item, id) => (
              <tr key={item._id}>
                <th>{id + 1}</th>
                <td>{item.hsCode}</td>
                <td>{item.description}</td>
                <td>{item.uom}</td>
                <td>{item.taxType.descriptionType}</td>
                <td>{item.qtyInHand}</td>
                <td>
                  <button
                    className="btn btn-sm me-2"
                    style={{
                      background: "#0A5275",
                      color: "white",
                    }}
                    onClick={() => editProduct(item._id)}
                  >
                    <MdModeEdit /> Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(item._id)}
                  >
                    <MdDelete /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</>

  );
};

export default Products;
