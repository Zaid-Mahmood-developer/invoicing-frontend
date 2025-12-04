import * as Yup from "yup";

export const products = [
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "HS Code:", name: "hsCode", type: "text", placeholder: "HS Code (####.####)" },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Product Description:", name: "description", type: "text", placeholder: "Description" },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Unit of Measure (UoM):", name: "uom", type: "dropdownUnit", placeholder: "Unit (e.g., Numbers , kg, pcs , PKTs)", options: ["Numbers ,  pieces , units", "KG", "PKTs", "Liter"] },
  {
    formLabelClass: "form-label", inputClass: "form-control", labelName: "Tax Type", name: "taxType", type: "text", placeholder: "Enter tax type", type: "dropdown",
    options: [
      { ScenarioId: "SN001", descriptionType: "Goods at standard rate to registered buyers", saleType: "Goods at standard rate (default)", salesTaxValue: 18 },
      { ScenarioId: "SN002", descriptionType: "Goods at standard rate to unregistered buyers", saleType: "Goods at standard rate (default)", salesTaxValue: 18 },
      { ScenarioId: "SN005", descriptionType: "Reduced rate sale", saleType: "Goods at Reduced Rate", salesTaxValue: 5 },
      { ScenarioId: "SN006", descriptionType: "Exempt goods sale", saleType: "Exempt Goods", salesTaxValue: 0 },
      { ScenarioId: "SN007", descriptionType: "Zero rated sale", saleType: "Goods at zero-rate", salesTaxValue: 0 },
      { ScenarioId: "SN008", descriptionType: "Sale of 3rd schedule goods", saleType: "3rd Schedule Goods", salesTaxValue: 18 },
      { ScenarioId: "SN019", descriptionType: "Sale of Services", saleType: "Services", salesTaxValue: 16 },
      { ScenarioId: "SN026", descriptionType: "Sale to End Consumer by retailers (Goods at Standard Rate)", saleType: "Goods at Standard Rate (default)", salesTaxValue: 18 },
      { ScenarioId: "SN027", descriptionType: "Sale to End Consumer by retailers (3rd Schedule Goods)", saleType: "3rd Schedule Goods", salesTaxValue: 18 },
      { ScenarioId: "SN028", descriptionType: "Sale to End Consumer by retailers (Goods at Reduced Rate)", saleType: "Goods at Reduced Rate", salesTaxValue: 5 }
    ]
  },
  { formLabelClass: "form-label", inputClass: "form-control", labelName: "Quantity On Hand:", name: "qtyInHand", type: "number", placeholder: "HS Code (####.####)" },
]

export const initialValues = {
  hsCode: "",
  description: "",
  uom: "Select UOM",
  taxType: { descriptionType: "", ScenarioId: "" , saleType  : "", salesTaxValue : "" },
  qtyInHand: 0,
}

export const validationSchema = Yup.object({
  hsCode: Yup.string()
    .matches(/^\d{4}\.\d{4}$/, "HS Code must be in ####.#### format")
    .required("HS Code is required"),
  description: Yup.string()
    .max(60, "Description must be at most 60 characters")
    .required("Description is required"),
  uom: Yup.string()
    .test(
      "not-default",
      "Please select uom",
      (value) =>
        value !== "Select UOM" && value !== "" && value !== undefined
    )
    .required("Uom is required"),
  taxType: Yup.object({
    descriptionType: Yup.string().required("Please select tax type"),
    ScenarioId: Yup.string().required(),
    salesTaxValue: Yup.string().required() ,
    saleType : Yup.string().required()
  })
    .required("Tax type is required"),
  qtyInHand: Yup.number()
    .moreThan(0, "Quantity must be greater than 0")
    .required("Quantity is required"),
});
