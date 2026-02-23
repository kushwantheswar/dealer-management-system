import { useState } from "react";

/*
  Props:
  - status (Open / Closed / etc.)
  - onTabChange (optional callback)
*/

const TabsSection = ({ status = "Open", onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Demanded Repair");

  const tabs = [
    "Demanded Repair",
    "Quotation",
    "Labour",
    "Parts",
    "Invoice",
  ];

  const handleTabClick = (tab) => {
    // Example business rule:
    // If RO is closed, prevent editing tabs except Invoice
    if (status === "Closed" && tab !== "Invoice") {
      return;
    }

    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-3">

        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const isLocked = status === "Closed" && tab !== "Invoice";

          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              disabled={isLocked}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
                ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Active Tab Display (Placeholder Content Area) */}
      <div className="mt-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {activeTab}
          </h3>

          <p className="text-sm text-gray-500">
            {activeTab} content will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabsSection;
