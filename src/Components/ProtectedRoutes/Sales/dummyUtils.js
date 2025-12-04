import * as Yup from "yup";

export const buyerInfo = [
  { heading: "Buyer Information" },
  { paragraphHeading: "Business Name", type: "dropDown", paragraphDetail: [] },
]

export const scenarioId = [
  { paragraphHeading: "Scenario ID", type: "dropDown", paragraphDetail: ["SN001" , "SN002" , "SN005", "SN006", "SN007", "SN008", "SN019", "SN026", "SN027", "SN028",] },
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
  furtherTax: "0" ,
   scenarioId: "",
   
   

   // Advanced Fields (Set default 0)
  discount: 0,
  fedPayable: 0,
  salesTaxWithheldAtSource: 0,
  valueWithoutTax: 0,
  fixedNotifiedValueOrRetailPrice: 0,

  // SRO (empty string by default)
  sroScheduleNo: "",
  sroItemSerialNo: "",
}
export const SRO_Schedule_Options_ReducedRates = [
  "",
  "EIGHTH SCHEDULE TABLE 1",
  "EIGHTH SCHEDULE TABLE 2",
];
// For Goods at Zero Rate (NEW)
export const SRO_Schedule_Options_ZeroRate = [
  "",
  "327(1)/2008",
  "FIFTH SCHEDULE",
  "SECTION 49" ,
  "SECTION 4(b)"
];
export const SRO_ItemSerial_Options_ReducedRates  = {
  "EIGHTH SCHEDULE TABLE 1": ["", "19", "2", "23" , "26(i)", "26(ii)", "26(iii)", "26(iv)", "26(v)", "26(vi)", "26(vii)", "26(viii)", "26(ix)", "26(x)", "26(xi)", "26(xii)", "26(xiii)", "26(xiv)", "26(xv)", "26(xvi)", "26(xvii)", "26(xviii)" , "27(i)" , "27(ii)", "27(iii)", "27(iv)", "27(v)", "27(vi)", "27(vii)" , "28(i)" ,"28(ii)" ,"28(iii)" ,"28(iv)" , "28(v)" ,"28(vi)" , "29(i)" , "29(ii)" , "29(iv)" , "29(ix)" , "29(v)" , "29(vi)" , "29(vii)" ,  "29(viii)" , "2929(x)" , "29(xi)" , "29(xiii)" , "29(xiv)" , "29(xv)" , "29(xvi)" , "29(xvii)" , "30(i)" , "30(ii)" , "34(1)" , "34(2)" , "34(3)" , "34(4)" , "43" , "44" , "5" , "67" , "77" , "83"],
  "EIGHTH SCHEDULE TABLE 2": [ "" , "2", "4(1)", "4(2)", "8(1)" , "8(2)", "8(3)", "8(4)", "8(5)" , "9"],
};
export const SRO_ItemSerial_Options_ZeroRate = {
  "327(1)/2008": ["", "1", "2", "3", "4"],
 "FIFTH SCHEDULE": ["", "1", "1(i)(a)", "1(i)b" , "1(ii)" , "1(ii)(a)" , "1(ii)(b)" , "1(iii)" , "1(iv)" , "1(v)" , "1(vi)" , "10" , "11" , "12(xxiii)" , "13" , "14" , "16" , "17" ,"20" , "2" , "21" , "5" , "6" , "6(A)(i)" , "6(A)(i)" ,  "6(A)(ii)", "6(A)(iii)","6(A)(iv)","6(A)(v)","6(A)(vi)","6(A)(vii)","6(A)(viii)","6(A)(x)", "7" , "8" , "8A" ],
 "SECTION 49": ["", "1"],
 "SECTION 4(b)": [""],
};
export const validationSchema = Yup.object({
  customerValue: Yup.string().when("customertype", {
    is: (val) => !!val,
    then: (schema) => schema.required("Buyer name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  productValue: Yup.string().required("Product name is required"),
    scenarioId: Yup.string().required("Scenario ID is a required field"),
  productQty: Yup.number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),
  productPrice: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
      valueWithoutTax: Yup.number().min(0).required(),
    fixedNotifiedValueOrRetailPrice: Yup.number()
    .typeError("Fixed notified value must be a number")
    .required("Fixed notified value is required")
    .min(0, "Value cannot be negative")
    .test(
      "gte-valueWithoutTax",
      "Fixed notified value must be greater than or equal to value excluding sales tax",
      function (fixedValue) {
        const { valueWithoutTax } = this.parent; // dynamic value from Formik
        return fixedValue >= (valueWithoutTax || 0);
      }
    ),
  // furtherTax: Yup.number()
  //   .typeError("Further Tax must be a number")
  //   .min(0, "Further Tax must be greater than or equal to 0")
  //   .when("customertype", {
  //     is: "Unregistered",
  //     then: (schema) =>
  //       schema
  //         .required("Further Tax is required for Un-Registered customers")
  //         .positive("Further Tax must be greater than 0"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
});