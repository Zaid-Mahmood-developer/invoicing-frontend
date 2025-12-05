import { useState, useEffect } from "react";
import { inputBox, tableHeading, initialValues, validationSchema } from "./dummyUtils";
import { IoAddOutline } from "react-icons/io5";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Spinner from "../../utils/Spinner/Spinner";
import { usePostApi } from "../../../customhooks/usePostApi";
import { usePutApi } from "../../../customhooks/usePutApi";
import { useDeleteApi } from "../../../customhooks/useDeleteApi";
import { useGetApi } from "../../../customhooks/useGetApi";

export default function Customers() {
  const [totalCustomers, setTotalCustomers] = useState([]);
  const [editMode, setEditMode] = useState({ active: false, id: null });

  const apiUrl = `${import.meta.env.VITE_API_URL}customer`;
  const currentCustomerId = editMode.id;
  const putUrl = currentCustomerId ? `${apiUrl}/${currentCustomerId}` : null;

  const { data: getData, loading: getLoading, error: getError, fetchData } = useGetApi(apiUrl);
  const { registerUser, data: postData, loading: postLoading, error: postError } = usePostApi(apiUrl);
  const { updateData, data: putData, loading: putLoading, error: putError } = usePutApi(putUrl);
  const { deleteUser, data: delData, loading: delLoading, error: delError } = useDeleteApi();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const finalValues = {
        ...values,
        contact: `+92-${values.contact}`
      };

      if (editMode.active && currentCustomerId) {
        await updateData(finalValues);
      } else {
        await registerUser(finalValues);
      }
      resetForm();
    },
  });

const editCustomerFunc = (id) => {
  const findCustomer = totalCustomers.find((item) => item._id === id);
  if (findCustomer) {
    // Strip +92- if it exists
    const contactWithoutPrefix = findCustomer.contact?.replace(/^\+92-/, "") || "";
    formik.setValues({
      ...findCustomer,
      contact: contactWithoutPrefix,
    });
    setEditMode({ active: true, id });
  }
};


  const delCustomerFunc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(`${apiUrl}/${id}`);
      }
    });
  };

  useEffect(() => {
    if (postData?.success) {
      Swal.fire("Success", "Customer has been added successfully", "success");
      fetchData(); // refresh
    }
    if (postError) {
      Swal.fire("Error", postError?.message || "Something went wrong", "error");
    }
  }, [postData, postError]);

  useEffect(() => {
    if (putData?.success) {
      Swal.fire("Success", "Customer has been updated successfully", "success");
      setEditMode({ active: false, id: null });
      formik.resetForm();
      fetchData(); // refresh
    }
    if (putError) {
      Swal.fire("Error", putError?.message || "Something went wrong", "error");
    }
  }, [putData, putError]);

  useEffect(() => {
    if (delData?.message) {
      Swal.fire("Deleted!", delData?.message, "success");
      fetchData(); // refresh
    }
    if (delError) {
      Swal.fire("Error", delError?.message || "Something went wrong", "error");
    }
  }, [delData, delError]);

  useEffect(() => {
    if (getData?.success) {
      setTotalCustomers(getData.data);
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
              👤 Customer Management
            </h2>

            <h3
              style={{
                color: "#0A5275",
                fontWeight: "600",
              }}
            >
              {editMode.active ? "✏️ Edit Customer" : "➕ Add Customer"}
            </h3>

            <form onSubmit={formik.handleSubmit}>
              <div className="container">
                <div className="row">
                  {inputBox.map((input, id) => (
                    <div key={id} className="col-md-4 col-sm-12">
                      <label style={{ fontWeight: 600, color: "#0A5275" }}>
                        {input.label}
                      </label>

                      {input.type === "dropdown" ? (
                        <select
                          name={input.name}
                          className={`form-select mb-3 ${formik.touched[input.name] && formik.errors[input.name]
                              ? "is-invalid"
                              : ""
                            }`}
                          value={formik.values[input.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{ borderColor: "#0A5275", padding: "10px" }}
                        >
                          <option value="">{input.placeholder}</option>
                          {input.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )
                        : input.name === "contact" ? (
                          // 🔵 Custom Contact Field with +92-
                        <div className="input-group mb-3">
  <span className="input-group-text">+92-</span>

  <input
    type="text"
    name="contact"
    className={`form-control ${
      formik.touched.contact && formik.errors.contact ? "is-invalid" : ""
    }`}
    placeholder="300-1234567"
    value={formik.values.contact}
    onChange={(e) => {
      let value = e.target.value.replace(/[^0-9]/g, ""); // allow digits only

      // auto-add dash after first 3 digits
      if (value.length > 3) {
        value = value.slice(0, 3) + "-" + value.slice(3);
      }

      // restrict max length: 3 + 1 + 7 = 11
      if (value.length > 11) return;

      formik.setFieldValue("contact", value);
    }}
    onBlur={formik.handleBlur}
    style={{ borderColor: "#0A5275", padding: "10px" }}
  />

  {formik.touched.contact && formik.errors.contact && (
    <div className="invalid-feedback">{formik.errors.contact}</div>
  )}
</div>

                        )
                          :
                          (
                            <input
                              className={`form-control mb-3 ${formik.touched[input.name] && formik.errors[input.name]
                                  ? "is-invalid"
                                  : ""
                                }`}
                              type={input.type}
                              name={input.name}
                              placeholder={input.placeholder}
                              value={formik.values[input.name]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              style={{ borderColor: "#0A5275", padding: "10px" }}
                            />
                          )}

                      {formik.touched[input.name] && formik.errors[input.name] && (
                        <div className="invalid-feedback">
                          {formik.errors[input.name]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn mt-3"
                style={{
                  background: "#0A5275",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {editMode.active ? (
                  <>
                    <RxUpdate className="fs-5" /> Update Customer
                  </>
                ) : (
                  <>
                    <IoAddOutline className="fs-4" /> Add Customer
                  </>
                )}
              </button>
            </form>
          </div>

          {/* CUSTOMER TABLE */}
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
                  {tableHeading.map((heading, id) => (
                    <th key={id} scope="col">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {totalCustomers?.map((item, id) => (
                  <tr key={item._id}>
                    <th scope="row">{id + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.ntnCnic}</td>
                    <td>{item.address}</td>
                    <td>{item.contact}</td>
                    <td>{item.province}</td>
                    <td>{item.customertype}</td>
                    <td>
                      <button
                        onClick={() => editCustomerFunc(item._id)}
                        className="btn btn-sm me-2"
                        style={{
                          background: "#0A5275",
                          color: "white",
                        }}
                      >
                        <MdModeEdit /> Edit
                      </button>
                      <button
                        onClick={() => delCustomerFunc(item._id)}
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
        </div>
      )}
    </>

  );
}
