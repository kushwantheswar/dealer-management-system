const FinanceSection = ({
  labourTotal,
  partsTotal,
  discount,
  setDiscount,
  gstPercent,
  setGstPercent,
}) => {

  const subTotal = labourTotal + partsTotal;

  const discountAmount = (subTotal * (Number(discount) || 0)) / 100;
  const taxableAmount = subTotal - discountAmount;

  const gstAmount = (taxableAmount * (Number(gstPercent) || 0)) / 100;
  const grandTotal = taxableAmount + gstAmount;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

      <h2 className="text-lg font-semibold mb-6">
        Finance Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Side */}
        <div className="space-y-4">

          <SummaryRow label="Labour Total" value={labourTotal} />
          <SummaryRow label="Parts Total" value={partsTotal} />
          <SummaryRow label="Sub Total" value={subTotal} bold />

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
              focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <SummaryRow
            label="Discount Amount"
            value={discountAmount}
          />

        </div>

        {/* Right Side */}
        <div className="space-y-4">

          <SummaryRow
            label="Taxable Amount"
            value={taxableAmount}
            bold
          />

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              GST (%)
            </label>
            <input
              type="number"
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
              focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <SummaryRow
            label="GST Amount"
            value={gstAmount}
          />

          <div className="border-t pt-4 mt-4">
            <SummaryRow
              label="Grand Total"
              value={grandTotal}
              highlight
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default FinanceSection;


/* ----------------- Helper Row ----------------- */

const SummaryRow = ({ label, value, bold, highlight }) => (
  <div className={`flex justify-between ${bold ? "font-semibold" : ""} ${highlight ? "text-indigo-600 text-lg font-bold" : ""}`}>
    <span>{label}</span>
    <span>₹ {Number(value || 0).toFixed(2)}</span>
  </div>
);
