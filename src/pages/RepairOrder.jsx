import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { labourList, partsList } from "../data/VehicleData";

/* ================= MODERN INPUT COMPONENT ================= */
const Input = ({ label, red, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className={`text-xs font-medium ${red ? "text-red-500" : "text-gray-600"}`}>
        {label} {red && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      {...props}
      className={`border rounded-lg px-3 py-2 text-sm transition-all outline-none
        ${red ? "border-red-300 bg-red-50 focus:ring-red-200" : "border-gray-200 bg-white focus:ring-indigo-200"}
        focus:ring-2 focus:border-indigo-400`}
    />
  </div>
);

/* ================= MODERN SELECT COMPONENT ================= */
const Select = ({ label, red, children, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className={`text-xs font-medium ${red ? "text-red-500" : "text-gray-600"}`}>
        {label} {red && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      {...props}
      className={`border rounded-lg px-3 py-2 text-sm outline-none transition-all
        ${red ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}
        focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400`}
    >
      {children}
    </select>
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
    serviceType: "",
    advisor: "",
    paymentMode: "",
  });

  const [errors, setErrors] = useState({});
  
  // States for Tables
  const [demandedRepair, setDemandedRepair] = useState([{ complaint: "", observation: "", action: "" }]);
  const [quotation, setQuotation] = useState([{ item: "", qty: 1, rate: 0, amount: 0 }]);
  const [labour, setLabour] = useState([{ name: "", hours: 1, rate: 0, amount: 0 }]);
  const [parts, setParts] = useState([{ partName: "", qty: 1, price: 0, total: 0 }]);
  
  // Other States
  const [complaints, setComplaints] = useState("");
  const [menu, setMenu] = useState({ generalService: false, oilChange: false, brakeCheck: false });
  const [serviceAction, setServiceAction] = useState("");
  const [pickupDrop, setPickupDrop] = useState({ pickupAddress: "", dropAddress: "", driverName: "", driverContact: "" });
  const [roadTest, setRoadTest] = useState("");

  /* ================= RO NUMBER GENERATOR ================= */
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("repairOrders")) || [];
    let nextNumber = 1;
    if (existing.length > 0) {
      const numbers = existing.map((order) => parseInt(order.roNumber.replace("RO-", "")));
      nextNumber = Math.max(...numbers) + 1;
    }
    setForm((prev) => ({ ...prev, roNumber: `RO-${nextNumber}` }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= VALIDATION ================= */
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

  /* ================= HANDLE SAVE ================= */
  const handleSaveAndView = () => {
    if (!validate()) {
      alert("Please fill all required fields marked in red.");
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
    saveCustomer(form);
    navigate(`/view-ro/${newOrder.id}`);
  };

  const saveCustomer = (formData) => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const existingIndex = customers.findIndex(c => c.mobile === formData.mobile);

    if (existingIndex > -1) {
      customers[existingIndex].lastVisit = new Date().toLocaleDateString();
      if (!customers[existingIndex].vehicles.includes(formData.registrationNo)) {
        customers[existingIndex].vehicles.push(formData.registrationNo);
      }
    } else {
      customers.push({
        id: Date.now(),
        name: formData.customerName,
        mobile: formData.mobile,
        email: formData.email,
        vehicles: [formData.registrationNo],
        lastVisit: new Date().toLocaleDateString()
      });
    }
    localStorage.setItem("customers", JSON.stringify(customers));
  };

  /* ================= DYNAMIC TABLE HANDLERS ================= */
  const handleAddRow = (state, setter, emptyRow) => setter([...state, emptyRow]);
  
  const handleRemoveRow = (state, setter, index) => {
    if (state.length > 1) setter(state.filter((_, i) => i !== index));
    else alert("At least one row is required.");
  };

  /* ================= LOGIC HANDLERS ================= */
  // 1. Quotation (Fixed Calculation)
  const handleQuotationChange = (index, field, value) => {
    const updated = [...quotation];
    updated[index][field] = value;
    const qty = parseFloat(updated[index].qty) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = qty * rate;
    setQuotation(updated);
  };

  // 2. Labour
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

  // 3. Parts
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

  const tabs = [
    "Demanded Repair", "Quotation", "Menu", "Labour", "Part", 
    "Complaints", "Service Action", "Pickup-Drop", "Road Test"
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-sm">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        {/* Header - UPDATED WITH DASHBOARD BUTTON */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Create Repair Order</h2>
            <p className="text-xs text-gray-500 mt-1">Fill details to generate a new Job Card</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs">
              {form.roNumber}
            </span>
            
            {/* BACK TO DASHBOARD BUTTON */}
            <Link 
              to="/" 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm text-xs font-medium"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* FORM GRID */}
        <div className="space-y-6">
          
          {/* Customer Details Card */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-bold text-indigo-800 text-xs mb-3 uppercase">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} red={errors.customerName} />
              <Input label="Mobile Number" name="mobile" type="tel" value={form.mobile} onChange={handleChange} red={errors.mobile} />
              <Input label="Email ID" name="email" type="email" value={form.email} onChange={handleChange} />
              <Input label="Date & Time" value={form.dateTime} readOnly />
            </div>
          </div>

          {/* Vehicle Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Registration No." name="registrationNo" value={form.registrationNo} onChange={handleChange} red={errors.registrationNo} />
            <Input label="Chassis No." name="chassisNo" value={form.chassisNo} onChange={handleChange} red={errors.chassisNo} />
            <Input label="Engine No." name="engineNo" value={form.engineNo} onChange={handleChange} red={errors.engineNo} />
            <Input label="KM Reading" name="kmReading" value={form.kmReading} onChange={handleChange} red={errors.kmReading} />
            
            <Select label="Service Type" name="serviceType" value={form.serviceType} onChange={handleChange} red={errors.serviceType}>
              <option value="">Select</option>
              <option>Free Service</option>
              <option>Paid Service</option>
              <option>Running Repairs</option>
            </Select>

            <Select label="Advisor" name="advisor" value={form.advisor} onChange={handleChange} red={errors.advisor}>
              <option value="">Select</option>
              <option>C PRASAD R</option>
              <option>NIAVS R</option>
            </Select>

            <Select label="Payment Mode" name="paymentMode" value={form.paymentMode} onChange={handleChange} red={errors.paymentMode}>
              <option value="">Select</option>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Credit</option>
            </Select>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all ${
                  activeTab === tab
                    ? "bg-white border border-b-white text-indigo-600 shadow-sm -mb-px"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[300px]">
          
          {/* DEMANDED REPAIR */}
          {activeTab === "Demanded Repair" && (
            <TableSection
              headers={["Complaint", "Observation", "Action", ""]}
              data={demandedRepair}
              renderRow={(row, index) => (
                <>
                  <td className="p-2"><input className="w-full bg-white border rounded p-2" value={row.complaint} onChange={(e) => { const u = [...demandedRepair]; u[index].complaint = e.target.value; setDemandedRepair(u); }} /></td>
                  <td className="p-2"><input className="w-full bg-white border rounded p-2" value={row.observation} onChange={(e) => { const u = [...demandedRepair]; u[index].observation = e.target.value; setDemandedRepair(u); }} /></td>
                  <td className="p-2"><input className="w-full bg-white border rounded p-2" value={row.action} onChange={(e) => { const u = [...demandedRepair]; u[index].action = e.target.value; setDemandedRepair(u); }} /></td>
                </>
              )}
              onAdd={() => handleAddRow(demandedRepair, setDemandedRepair, { complaint: "", observation: "", action: "" })}
              onRemove={(i) => handleRemoveRow(demandedRepair, setDemandedRepair, i)}
            />
          )}

          {/* QUOTATION */}
          {activeTab === "Quotation" && (
             <TableSection
             headers={["Item", "Qty", "Rate", "Amount", ""]}
             data={quotation}
             renderRow={(row, index) => (
               <>
                 <td className="p-2"><input className="w-full bg-white border rounded p-2" value={row.item} onChange={(e) => handleQuotationChange(index, "item", e.target.value)} /></td>
                 <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2" value={row.qty} onChange={(e) => handleQuotationChange(index, "qty", e.target.value)} /></td>
                 <td className="p-2 w-32"><input type="number" className="w-full bg-white border rounded p-2" value={row.rate} onChange={(e) => handleQuotationChange(index, "rate", e.target.value)} /></td>
                 <td className="p-2 w-32 font-semibold text-green-700">{row.amount}</td>
               </>
             )}
             onAdd={() => handleAddRow(quotation, setQuotation, { item: "", qty: 1, rate: 0, amount: 0 })}
             onRemove={(i) => handleRemoveRow(quotation, setQuotation, i)}
           />
          )}

          {/* LABOUR */}
          {activeTab === "Labour" && (
            <TableSection
              headers={["Labour Type", "Hours", "Rate", "Amount", ""]}
              data={labour}
              renderRow={(row, index) => (
                <>
                  <td className="p-2">
                    <select className="w-full bg-white border rounded p-2" value={row.name} onChange={(e) => handleLabourChange(index, "name", e.target.value)}>
                      <option value="">Select</option>
                      {labourList.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </td>
                  <td className="p-2 w-20"><input type="number" className="w-full bg-white border rounded p-2" value={row.hours} onChange={(e) => handleLabourChange(index, "hours", e.target.value)} /></td>
                  <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2" value={row.rate} onChange={(e) => handleLabourChange(index, "rate", e.target.value)} /></td>
                  <td className="p-2 w-24 font-semibold text-green-700">{row.amount}</td>
                </>
              )}
              onAdd={() => handleAddRow(labour, setLabour, { name: "", hours: 1, rate: 0, amount: 0 })}
              onRemove={(i) => handleRemoveRow(labour, setLabour, i)}
            />
          )}

          {/* PARTS */}
          {activeTab === "Part" && (
            <TableSection
              headers={["Part Name", "Qty", "Price", "Total", ""]}
              data={parts}
              renderRow={(row, index) => (
                <>
                  <td className="p-2">
                    <select className="w-full bg-white border rounded p-2" value={row.partName} onChange={(e) => handlePartsChange(index, "partName", e.target.value)}>
                      <option value="">Select</option>
                      {partsList.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </td>
                  <td className="p-2 w-20"><input type="number" className="w-full bg-white border rounded p-2" value={row.qty} onChange={(e) => handlePartsChange(index, "qty", e.target.value)} /></td>
                  <td className="p-2 w-24"><input type="number" className="w-full bg-white border rounded p-2" value={row.price} onChange={(e) => handlePartsChange(index, "price", e.target.value)} /></td>
                  <td className="p-2 w-24 font-semibold text-green-700">{row.total}</td>
                </>
              )}
              onAdd={() => handleAddRow(parts, setParts, { partName: "", qty: 1, price: 0, total: 0 })}
              onRemove={(i) => handleRemoveRow(parts, setParts, i)}
            />
          )}

          {/* MENU */}
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

          {/* TEXTAREAS */}
          {activeTab === "Complaints" && <textarea className="w-full bg-white border rounded-lg p-3" rows="5" placeholder="Customer complaints..." value={complaints} onChange={(e) => setComplaints(e.target.value)} />}
          {activeTab === "Service Action" && <textarea className="w-full bg-white border rounded-lg p-3" rows="5" placeholder="Service actions..." value={serviceAction} onChange={(e) => setServiceAction(e.target.value)} />}
          {activeTab === "Road Test" && <textarea className="w-full bg-white border rounded-lg p-3" rows="5" placeholder="Road test report..." value={roadTest} onChange={(e) => setRoadTest(e.target.value)} />}

          {/* PICKUP-DROP */}
          {activeTab === "Pickup-Drop" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Pickup Address" value={pickupDrop.pickupAddress} onChange={(e) => setPickupDrop({ ...pickupDrop, pickupAddress: e.target.value })} />
              <Input label="Drop Address" value={pickupDrop.dropAddress} onChange={(e) => setPickupDrop({ ...pickupDrop, dropAddress: e.target.value })} />
              <Input label="Driver Name" value={pickupDrop.driverName} onChange={(e) => setPickupDrop({ ...pickupDrop, driverName: e.target.value })} />
              <Input label="Driver Contact" value={pickupDrop.driverContact} onChange={(e) => setPickupDrop({ ...pickupDrop, driverContact: e.target.value })} />
            </div>
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-4 mt-6 border-t pt-6">
          <button onClick={() => navigate(-1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
            Cancel
          </button>
          <button
            onClick={handleSaveAndView}
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 shadow-md font-semibold"
          >
            Save & View RO
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE TABLE COMPONENT ================= */
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