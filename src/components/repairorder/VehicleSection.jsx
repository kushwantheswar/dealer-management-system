import { useState } from "react";

/* -------- Reusable Input Component -------- */

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
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
      className={`w-full border rounded-lg px-3 py-2 text-sm 
      focus:outline-none focus:ring-2 transition
      ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-500"
      }`}
      {...props}
    />

    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

/* -------- Main Component -------- */

const VehicleSection = () => {
  const [form, setForm] = useState({
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    model: "",
    variant: "",
    fuelType: "",
    transmission: "",
    odometer: "",
    serviceType: "",
    manufactureYear: "",
    warranty: "No",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------- Validation -------- */

  const validate = () => {
    let newErrors = {};

    if (!form.registrationNumber.trim())
      newErrors.registrationNumber = "Registration number required";

    if (!form.chassisNumber.trim())
      newErrors.chassisNumber = "Chassis number required";

    if (!form.engineNumber.trim())
      newErrors.engineNumber = "Engine number required";

    if (!form.odometer || form.odometer <= 0)
      newErrors.odometer = "Enter valid odometer reading";

    if (!form.model.trim())
      newErrors.model = "Vehicle model required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Vehicle Data:", form);
    alert("Vehicle saved successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg space-y-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
        Vehicle Details
      </h2>

      {/* Basic Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Input
          label="Registration Number"
          name="registrationNumber"
          value={form.registrationNumber}
          onChange={handleChange}
          required
          error={errors.registrationNumber}
          placeholder="AP 39 AB 1234"
        />

        <Input
          label="Chassis Number"
          name="chassisNumber"
          value={form.chassisNumber}
          onChange={handleChange}
          required
          error={errors.chassisNumber}
        />

        <Input
          label="Engine Number"
          name="engineNumber"
          value={form.engineNumber}
          onChange={handleChange}
          required
          error={errors.engineNumber}
        />
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Input
          label="Model"
          name="model"
          value={form.model}
          onChange={handleChange}
          required
          error={errors.model}
        />

        <Input
          label="Variant"
          name="variant"
          value={form.variant}
          onChange={handleChange}
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Service Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <Input
          label="Odometer Reading (KM)"
          name="odometer"
          type="number"
          value={form.odometer}
          onChange={handleChange}
          required
          error={errors.odometer}
        />

        <Input
          label="Manufacture Year"
          name="manufactureYear"
          type="number"
          value={form.manufactureYear}
          onChange={handleChange}
          placeholder="2023"
        />
      </div>

      {/* Service Type + Warranty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Service</option>
            <option value="Free Service">Free Service</option>
            <option value="Paid Service">Paid Service</option>
            <option value="Accidental Repair">Accidental Repair</option>
            <option value="General Checkup">General Checkup</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Under Warranty
          </label>
          <select
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          Save Vehicle
        </button>
      </div>
    </form>
  );
};

export default VehicleSection;
