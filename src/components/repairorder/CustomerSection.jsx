import { useEffect, useState } from "react";

/* ---------------- Reusable Input Component ---------------- */

const Input = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  type = "text",
  disabled = false,
  ...props
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-lg px-3 py-2 text-sm 
      focus:outline-none focus:ring-2 transition
      ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-500"
      }
      ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
      `}
      {...props}
    />

    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

/* ---------------- Main Component ---------------- */

const CustomerSection = () => {
  const [form, setForm] = useState({
    customerId: "",
    customerType: "",
    customerName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Auto Generate Customer ID ---------------- */
  useEffect(() => {
    const randomId = "CUST-" + Math.floor(100000 + Math.random() * 900000);
    setForm((prev) => ({ ...prev, customerId: randomId }));
  }, []);

  /* ---------------- Handle Change ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- Validation Logic ---------------- */
  const validate = () => {
    let newErrors = {};

    if (!form.customerName.trim())
      newErrors.customerName = "Customer name is required";

    if (!/^[0-9]{10}$/.test(form.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.customerType)
      newErrors.customerType = "Select customer type";

    if (form.customerType === "corporate" && !form.gstNumber)
      newErrors.gstNumber = "GST number required for corporate";

    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode))
      newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Customer Data:", form);
    alert("Customer saved successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg space-y-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
        Customer Details
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Customer ID"
          name="customerId"
          value={form.customerId}
          disabled
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Customer Type <span className="text-red-500">*</span>
          </label>
          <select
            name="customerType"
            value={form.customerType}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 ${
              errors.customerType
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Type</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
          {errors.customerType && (
            <span className="text-xs text-red-500 mt-1">
              {errors.customerType}
            </span>
          )}
        </div>

        <Input
          label="Customer Name"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          required
          error={errors.customerName}
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Mobile Number"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          error={errors.mobile}
          maxLength={10}
        />

        <Input
          label="Alternate Mobile"
          name="alternateMobile"
          value={form.alternateMobile}
          onChange={handleChange}
          maxLength={10}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      {/* Corporate GST */}
      {form.customerType === "corporate" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="GST Number"
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            required
            error={errors.gstNumber}
          />
        </div>
      )}

      {/* Address Info */}
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Address Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <Input
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
        />

        <Input
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
        />

        <Input
          label="Pincode"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          error={errors.pincode}
          maxLength={6}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Save Customer
        </button>
      </div>
    </form>
  );
};

export default CustomerSection;
