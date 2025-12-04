import * as Yup from "yup";

export const loginFields = [
    { label: "Username", name: "username", type: "text", value: "", placeholder: "Username" },
    { label: "Email", name: "email", type: "email", value: "", placeholder: "Email" },
    { label: "Password", name: "password", type: "password", value: "", placeholder: "Password", subLabel: "Forgot Password" }
]

export const initialValues = loginFields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
}, {});

export const validationSchema = Yup.object({
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password length cannot be greater than 16 characters")
});

export const signupFields = [
    { label: "NTN/CNIC", name: "ntncninc", type: "text", value: "", placeholder: "NTN/CNIC" },
    { label: "Business Name", name: "businessname", type: "text", value: "", placeholder: "Business Name" },
    { label: "Province", name: "province", type: "dropdown", value: "", placeholder: "Please Select Province", options: ["Islamabad Capital Territory", "Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkua", "FATA", "Gilgit Baltistan"] },
    { label: "Address", name: "address", type: "text", value: "", placeholder: "Address" },
    { label: "Email", name: "email", type: "email", placeholder: "Email" },
    { label: "Username", name: "username", type: "text", value: "", placeholder: "Username" },
    { label: "Password", name: "password", type: "password", value: "", placeholder: "Password" },
    { label: "Confirm Password", name: "confirmpassword", type: "password", value: "", placeholder: "Confirm Password" },
    { label: "Security Code", name: "securitycode", type: "text", value: "", placeholder: "Security Code" }
]
export const signupInitialValues = {
    ntncninc: "",
    businessname: "",
    province: "",
    address: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    securitycode: ""
};

// ✅ Validation Schema
export const signupValidationSchema = Yup.object({
    ntncninc: Yup.string()
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

    businessname: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
        .max(16, "Maximum 16 characters")
        .required("Business name is required"),

    province: Yup.string()
        .notOneOf(["Select province"], "Please select a valid province")
        .required("Province is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    address: Yup.string()
        .matches(/^[A-Za-z0-9\s,.-]+$/, "Only letters, numbers, commas, periods allowed")
        .max(16, "Maximum 16 characters")
        .required("Address is required"),

    username: Yup.string()
        .max(16, "Maximum 16 characters are allowed")
        .required("Username is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Maximum 16 characters are allowed")
        .required("Password is required"),

    confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Confirm Password must match with password")
        .required("Confirm password is required"),
    securitycode: Yup.string()
        .min(4, "Minimum 4 characters are allowed")
        .required("Security code is required"),
});

export const forgotPasswordInitialValues = { email: "" };

export const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

export const resetPasswordInitialValues = { password: "", confirmPassword: "" };

export const resetPasswordValidationSchema = Yup.object({
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Maximum 16 characters are allowed")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
});

export const changePasswordInitialValues = { oldPassword: "", newPassword: "" };
export const changePasswordValidationSchema = Yup.object({
            oldPassword: Yup.string()
                .required("Old password is required")
                .min(6, "Password must be at least 6 characters"),
            newPassword: Yup.string()
                .required("New password is required")
                .min(6, "Password must be at least 6 characters"),
        })