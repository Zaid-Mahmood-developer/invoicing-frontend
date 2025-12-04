
import * as Yup from "yup";
export const inputBox = [
  { id: 1, label: "Customer Name", name: "name", placeholder: "Customer Name", type: "text" },
  { id: 2, label: "Customer NTN / CNIC", name: "ntnCnic", placeholder: "Customer NTN / CNIC", type: "text" },
  { id: 3, label: "Address", name: "address", placeholder: "Address", type: "text" },
  { id: 4, label: "Contact No.", name: "contact", placeholder: "Contact No.", type: "text" },
  // { id: 5, label: "Product Description", name: "product", type: "dropdown", placeholder: "Select Product Description", options: [] }, 
  { id: 5, label: "Province", name: "province", type: "dropdown", placeholder: "Select province", options: ["Islamabad Capital Territory", "Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkua", "FATA", "Gilgit Baltistan"] },
   { id: 6, label: "Customer Type", name: "customertype", type: "dropdown", placeholder: "Select Customer Type", options: ["Registered", "Unregistered"] }
]

export const tableHeading = ["Sr. No", "Customer Name", "Customer NTN / CNIC", "Address", "Contact No.",  "Province" , "Customer Type" , "Actions"]

export const initialValues = {
  name: "",
  ntnCnic: "",
  address: "",
  contact: "",
  // product: "Select preferred product",
  province: "Select province",
  customertype:"Select Customer Type"
}

export const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z ]*$/, "Only alphabets and spaces allowed")
    .max(30, "Maximum 30 characters allowed")
    .required("Customer name is required"),
  ntnCnic: Yup.string()
  .required("NTN or CNIC is required")
  .test(
    "ntn-cnic-format",
    "Must be a valid NTN (7 digits) or CNIC (13 digits, digits only — no dashes)",
    (value) => {
      if (!value) return false;
      if (/\D/.test(value)) return false;
      const isNTN = value.length === 7;
      const isCNIC = value.length === 13;
      return isNTN || isCNIC;
    }
  )
    .required("NTN or CNIC is required"),
  address: Yup.string()
    .matches(/^[A-Za-z0-9\s,.\-\/()]+$/, "Invalid characters in address")
    .required("Address is required"),
  contact: Yup.string()
    .matches(/^\+92-[0-9]{3}-[0-9]{7}$/, "Format must be +92-XXX-XXXXXXX")
    .required("Contact number is required"),
  
  province: Yup.string()
    .test(
      "not-default",
      "Please select a province",
      (value) =>
        value !== "Select province" && value !== "" && value !== undefined
    )
    .required("Province is required"),
    customertype : Yup.string()
    .test(
      "not-default" ,
      "Please select customer type" ,
      (value)=>value !== "Select Customer Type" && value !== "" && value !== undefined
    )
    .required("Customer type is required")
});