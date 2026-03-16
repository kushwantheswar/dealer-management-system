import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// Import the new vehicleModels list along with existing ones
import { labourList, partsList, vehicleModels } from "../data/VehicleData";

/* ================= EMBEDDED UI COMPONENTS ================= */

const Card = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    {title && (
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const FormInput = ({ label, name, value, onChange, error, required, type = "text", placeholder = "", ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm transition-all outline-none
        ${error ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-200 bg-white focus:ring-indigo-200"}
        focus:ring-2 focus:border-indigo-400`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-0.5">Required</span>}
  </div>
);

const FormSelect = ({ label, name, value, onChange, error, required, options = [], disabled = false, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm transition-all outline-none bg-white
        ${error ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-200 bg-white focus:ring-indigo-200"}
        focus:ring-2 focus:border-indigo-400 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      {...props}
    >
      <option value="">Select</option>
      {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TableSection = ({ headers, data, renderRow, onAdd, onRemove }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase">
          {headers.map((h, i) => <th key={i} className="p-2 text-left font-semibold border">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            {renderRow(row, index)}
            <td className="p-2 text-center">
              <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 font-bold text-xs p-1">✕</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onAdd} className="mt-3 bg-white border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50 w-full py-2 rounded text-xs font-medium">
      + Add Row
    </button>
  </div>
);

/* ================= MAIN COMPONENT ================= */
export default function RepairOrder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Demanded Repair");

  const [form, setForm] = useState({
    roNumber: "",
    dateTime: new Date().toLocaleString(),
    status: "Open",
    customerName: "",
    mobile: "",
    email: "",
    registrationNo: "",
    chassisNo: "",
    engineNo: "",
    kmReading: "",
    brand: "", // New Field
    model: "", // New Field
    fuelType: "",
    serviceType: "",
    advisor: "",
    paymentMode: "",
  });

  const [errors, setErrors] = useState({});
  const [demandedRepair, setDemandedRepair] = useState([{ complaint: "", observation: "", action: "" }]);
  const [quotation, setQuotation] = useState([{ item: "", qty: 1, rate: 0, amount: 0 }]);
  const [labour, setLabour] = useState([{ name: "", hours: 1, rate: 0, amount: 0 }]);
  const [parts, setParts] = useState([{ partName: "", qty: 1, price: 0, total: 0 }]);
  const [complaints, setComplaints] = useState("");
  const [menu, setMenu] = useState({ generalService: false, oilChange: false, brakeCheck: false });
  const [serviceAction, setServiceAction] = useState("");
  const [pickupDrop, setPickupDrop] = useState({ pickupAddress: "", dropAddress: "", driverName: "", driverContact: "" });
  const [roadTest, setRoadTest] = useState("");

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("repairOrders")) || [];
    let nextNumber = 1;
    if (existing.length > 0) {
      const numbers = existing.map((order) => parseInt(order.roNumber.replace("RO-", "")));
      nextNumber = Math.max(...numbers) + 1;
    }
    setForm((prev) => ({ ...prev, roNumber: `RO-${nextNumber}` }));
  }, []);

  // Modified handleChange to reset Model if Brand changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If Brand changes, reset Model
    if (name === "brand") {
      setForm({ ...form, brand: value, model: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.registrationNo.trim()) newErrors.registrationNo = true;
    if (!form.chassisNo.trim()) newErrors.chassisNo = true;
    if (!form.engineNo.trim()) newErrors.engineNo = true;
    if (!form.kmReading.trim()) newErrors.kmReading = true;
    if (!form.serviceType) newErrors.serviceType = true;
    if (!form.advisor) newErrors.advisor = true;
    if (!form.paymentMode) newErrors.paymentMode = true;
    if (!form.customerName.trim()) newErrors.customerName = true;
    if (!form.mobile.trim()) newErrors.mobile = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndView = () => {
    if (!validate()) {
      alert("Please fill all required fields.");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("repairOrders")) || [];
    const newOrder = {
      id: Date.now(),
      ...form,
      demandedRepair,
      quotation,
      labour,
      parts,
      menu,
      complaints,
      serviceAction,
      pickupDrop,
      roadTest,
    };
    existing.push(newOrder);
    localStorage.setItem("repairOrders", JSON.stringify(existing));
    navigate(`/view-ro/${newOrder.id}`);
  };

  const handleAddRow = (state, setter, emptyRow) => setter([...state, emptyRow]);
  const handleRemoveRow = (state, setter, index) => {
    if (state.length > 1) setter(state.filter((_, i) => i !== index));
    else alert("At least one row is required.");
  };

  const handleQuotationChange = (index, field, value) => {
    const updated = [...quotation];
    updated[index][field] = value;
    const qty = parseFloat(updated[index].qty) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = qty * rate;
    setQuotation(updated);
  };

  const handleLabourChange = (index, field, value) => {
    const updated = [...labour];
    updated[index][field] = value;
    if (field === "name") {
      const selectedItem = labourList.find(item => item.name === value);
      if (selectedItem) updated[index].rate = selectedItem.rate;
    }
    const hours = parseFloat(updated[index].hours) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = hours * rate;
    setLabour(updated);
  };

  const handlePartsChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    if (field === "partName") {
      const selectedItem = partsList.find(item => item.name === value);
      if (selectedItem) updated[index].price = selectedItem.price;
    }
    const qty = parseFloat(updated[index].qty) || 0;
    const price = parseFloat(updated[index].price) || 0;
    updated[index].total = qty * price;
    setParts(updated);
  };

  // Logic to get models based on selected brand
  const selectedBrandData = vehicleModels.find(v => v.brand === form.brand);
  const availableModels = selectedBrandData ? selectedBrandData.models : [];
  const brandOptions = vehicleModels.map(v => v.brand);

  const tabs = ["Demanded Repair", "Quotation", "Menu", "Labour", "Part", "Complaints", "Service Action", "Pickup-Drop", "Road Test"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Job Card</h2>
            <p className="text-gray-500 text-xs mt-1">Fill details to generate a new Repair Order</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-lg text-sm shadow">{form.roNumber}</span>
            <Link to="/" className="flex items-center gap-2 bg-white border text-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50">
              <span>🏠</span> Dashboard
            </Link>
          </div>
        </div>

        <Card title="Customer Information" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <FormInput label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} required error={errors.customerName} />
            <FormInput label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} required error={errors.mobile} />
            <FormInput label="Email ID" name="email" value={form.email} onChange={handleChange} />
            <FormInput label="Date & Time" value={form.dateTime} readOnly />
          </div>
        </Card>

        <Card title="Vehicle Details" icon="🚗">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <FormInput label="Registration No." name="registrationNo" value={form.registrationNo} onChange={handleChange} required error={errors.registrationNo} />
            <FormInput label="Chassis No." name="chassisNo" value={form.chassisNo} onChange={handleChange} required error={errors.chassisNo} />
            <FormInput label="Engine No." name="engineNo" value={form.engineNo} onChange={handleChange} required error={errors.engineNo} />
            
            {/* NEW: Brand Dropdown */}
            <FormSelect 
              label="Brand" 
              name="brand" 
              value={form.brand} 
              onChange={handleChange} 
              options={brandOptions} 
            />

            {/* NEW: Dynamic Model Dropdown */}
            <FormSelect 
              label="Model" 
              name="model" 
              value={form.model} 
              onChange={handleChange} 
              options={availableModels}
              disabled={!form.brand} // Disabled if no brand selected
            />

            <FormInput label="KM Reading" name="kmReading" type="number" value={form.kmReading} onChange={handleChange} required error={errors.kmReading} />
            
            <FormSelect label="Fuel Type" name="fuelType" value={form.fuelType} onChange={handleChange} options={["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]} />
            <FormSelect label="Service Type" name="serviceType" value={form.serviceType} onChange={handleChange} required error={errors.serviceType} options={["Free Service", "Paid Service", "Running Repairs"]} />
            <FormSelect label="Advisor" name="advisor" value={form.advisor} onChange={handleChange} required error={errors.advisor} options={["C PRASAD R", "NIAVS R"]} />
            <FormSelect label="Payment Mode" name="paymentMode" value={form.paymentMode} onChange={handleChange} required error={errors.paymentMode} options={["Cash", "Card", "UPI", "Credit"]} />
          </div>
        </Card>

        <Card title="Service Details" icon="🔧">
          <div className="border-b border-gray-200 mb-4 -mt-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all ${
                    activeTab === tab ? "bg-white border border-b-white text-indigo-600 shadow-sm -mb-px" : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-96">
            {activeTab === "Demanded Repair" && (
              <TableSection headers={["Complaint", "Observation", "Action", ""]} data={demandedRepair}
                renderRow={(row, index) => (
                  <>
                    <td className="p-2"><input className="w-full bg-white border rounded p-2 text-xs" value={row.complaint} onChange={(e) => { const u = [...demandedRepair]; u[index].complaint = e.target.value; setDemandedRepair(u); }} /></td>
                    <td className="p-2"><input className="w-full bg-white border rounded p-2 text-xs" value={row.observation} onChange={(e) => { const u = [...demandedRepair]; u[index].observation = e.target.value; setDemandedRepair(u); }} /></td>
                    <td className="p-2"><input className="w-full bg-white border rounded p-2 text-xs" value={row.action} onChange={(e) => { const u = [...demandedRepair]; u[index].action = e.target.value; setDemandedRepair(u); }} /></td>
                  </>
                )}
                onAdd={() => handleAddRow(demandedRepair, setDemandedRepair, { complaint: "", observation: "", action: "" })}
                onRemove={(i) => handleRemoveRow(demandedRepair, setDemandedRepair, i)}
              />
            )}
            {activeTab === "Quotation" && (
              <TableSection headers={["Item", "Qty", "Rate", "Amount", ""]} data={quotation}
                renderRow={(row, index) => (
                  <>
                    <td className="p-2"><input className="w-full bg-white border rounded p-2 text-xs" value={row.item} onChange={(e) => handleQuotationChange(index, "item", e.target.value)} /></td>
                    <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.qty} onChange={(e) => handleQuotationChange(index, "qty", e.target.value)} /></td>
                    <td className="p-2 w-32"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.rate} onChange={(e) => handleQuotationChange(index, "rate", e.target.value)} /></td>
                    <td className="p-2 w-32 font-semibold text-green-700">₹{row.amount}</td>
                  </>
                )}
                onAdd={() => handleAddRow(quotation, setQuotation, { item: "", qty: 1, rate: 0, amount: 0 })}
                onRemove={(i) => handleRemoveRow(quotation, setQuotation, i)}
              />
            )}
            {activeTab === "Labour" && (
              <TableSection headers={["Labour Type", "Hours", "Rate", "Amount", ""]} data={labour}
                renderRow={(row, index) => (
                  <>
                    <td className="p-2">
                      <select className="w-full bg-white border rounded p-2 text-xs" value={row.name} onChange={(e) => handleLabourChange(index, "name", e.target.value)}>
                        <option value="">Select</option>
                        {labourList.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                      </select>
                    </td>
                    <td className="p-2 w-20"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.hours} onChange={(e) => handleLabourChange(index, "hours", e.target.value)} /></td>
                    <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.rate} onChange={(e) => handleLabourChange(index, "rate", e.target.value)} /></td>
                    <td className="p-2 w-24 font-semibold text-green-700">₹{row.amount}</td>
                  </>
                )}
                onAdd={() => handleAddRow(labour, setLabour, { name: "", hours: 1, rate: 0, amount: 0 })}
                onRemove={(i) => handleRemoveRow(labour, setLabour, i)}
              />
            )}
            {activeTab === "Part" && (
              <TableSection headers={["Part Name", "Qty", "Price", "Total", ""]} data={parts}
                renderRow={(row, index) => (
                  <>
                    <td className="p-2">
                      <select className="w-full bg-white border rounded p-2 text-xs" value={row.partName} onChange={(e) => handlePartsChange(index, "partName", e.target.value)}>
                        <option value="">Select</option>
                        {partsList.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                      </select>
                    </td>
                    <td className="p-2 w-20"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.qty} onChange={(e) => handlePartsChange(index, "qty", e.target.value)} /></td>
                    <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2 text-xs" value={row.price} onChange={(e) => handlePartsChange(index, "price", e.target.value)} /></td>
                    <td className="p-2 w-24 font-semibold text-green-700">₹{row.total}</td>
                  </>
                )}
                onAdd={() => handleAddRow(parts, setParts, { partName: "", qty: 1, price: 0, total: 0 })}
                onRemove={(i) => handleRemoveRow(parts, setParts, i)}
              />
            )}
            {activeTab === "Menu" && (
              <div className="space-y-3 p-4 bg-white rounded-lg border max-w-md">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={menu.generalService} onChange={(e) => setMenu({ ...menu, generalService: e.target.checked })} />
                  <span>General Service</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={menu.oilChange} onChange={(e) => setMenu({ ...menu, oilChange: e.target.checked })} />
                  <span>Oil Change</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={menu.brakeCheck} onChange={(e) => setMenu({ ...menu, brakeCheck: e.target.checked })} />
                  <span>Brake Check</span>
                </label>
              </div>
            )}
            {activeTab === "Complaints" && <textarea className="w-full bg-white border rounded-lg p-3 text-xs" rows="5" placeholder="Customer complaints..." value={complaints} onChange={(e) => setComplaints(e.target.value)} />}
            {activeTab === "Service Action" && <textarea className="w-full bg-white border rounded-lg p-3 text-xs" rows="5" placeholder="Service actions..." value={serviceAction} onChange={(e) => setServiceAction(e.target.value)} />}
            {activeTab === "Road Test" && <textarea className="w-full bg-white border rounded-lg p-3 text-xs" rows="5" placeholder="Road test report..." value={roadTest} onChange={(e) => setRoadTest(e.target.value)} />}
            {activeTab === "Pickup-Drop" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Pickup Address" value={pickupDrop.pickupAddress} onChange={(e) => setPickupDrop({ ...pickupDrop, pickupAddress: e.target.value })} />
                <FormInput label="Drop Address" value={pickupDrop.dropAddress} onChange={(e) => setPickupDrop({ ...pickupDrop, dropAddress: e.target.value })} />
                <FormInput label="Driver Name" value={pickupDrop.driverName} onChange={(e) => setPickupDrop({ ...pickupDrop, driverName: e.target.value })} />
                <FormInput label="Driver Contact" value={pickupDrop.driverContact} onChange={(e) => setPickupDrop({ ...pickupDrop, driverContact: e.target.value })} />
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-4 pb-10">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm">Cancel</button>
          <button onClick={handleSaveAndView} className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md font-semibold text-sm">Save & View RO</button>
        </div>

      </div>
    </div>
  );
}