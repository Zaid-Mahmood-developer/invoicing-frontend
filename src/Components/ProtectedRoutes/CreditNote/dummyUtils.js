import * as Yup from "yup";

export const buyerInfo = [
  { heading: "Buyer Information" },
  { paragraphHeading: "Business Name", type: "dropDown", paragraphDetail: [] },
]

export const addItem = [
  { heading: "Add Item" },
  { type: "dropDown", prductDescriptionHeading: "Product Name", productDescription: [], HsCode: "", Qunatity: 0, valueWithoutTax: "", salesTax: "", furtherTax: "" }
]

export const initialValues = {
  customerValue: "",
  productValue: "",
  customertype: "",
  productQty: "0",
  productPrice: "0",
  furtherTax: "0"
}

export const validationSchema = Yup.object({
  customerValue: Yup.string().when("customertype", {
    is: (val) => !!val, 
    then: (schema) => schema.required("Buyer name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  productValue: Yup.string().required("Product name is required"),
  productQty: Yup.number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),
  productPrice: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  furtherTax: Yup.number()
    .typeError("Further Tax must be a number")
    .min(0, "Further Tax must be greater than or equal to 0")
    .when("customertype", {
      is: "Unregistered",
      then: (schema) =>
        schema
          .required("Further Tax is required for Un-Registered customers")
          .positive("Further Tax must be greater than 0"),
      otherwise: (schema) => schema.notRequired(),
    }),
});