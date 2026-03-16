// File: src/data/VehicleData.js

// Expanded Data for Labour Charges
export const labourList = [
  // General Service
  { id: 1, name: "General Service (Car)", rate: 1200 },
  { id: 2, name: "General Service (SUV)", rate: 1500 },
  { id: 3, name: "Oil Change", rate: 300 },
  { id: 4, name: "Car Wash (Standard)", rate: 500 },
  { id: 5, name: "Car Wash (Premium)", rate: 1000 },
  { id: 6, name: "Interior Deep Cleaning", rate: 2500 },

  // Brakes & Suspension
  { id: 7, name: "Brake Pad Replacement (Front)", rate: 800 },
  { id: 8, name: "Brake Pad Replacement (Rear)", rate: 900 },
  { id: 9, name: "Brake Disc Skimming", rate: 1500 },
  { id: 10, name: "Wheel Alignment", rate: 600 },
  { id: 11, name: "Wheel Balancing", rate: 500 },
  { id: 12, name: "Shock Absorber Replacement (Per Side)", rate: 1200 },
  { id: 13, name: "Suspension Overhaul", rate: 4500 },

  // Engine & Transmission
  { id: 14, name: "Engine Tuning", rate: 2500 },
  { id: 15, name: "Engine Overhaul", rate: 15000 },
  { id: 16, name: "Clutch Plate Replacement", rate: 4500 },
  { id: 17, name: "Gearbox Repair", rate: 6000 },
  { id: 18, name: "Spark Plug Replacement", rate: 400 },
  { id: 19, name: "Timing Belt Replacement", rate: 3500 },
  { id: 20, name: "Head Gasket Replacement", rate: 8000 },

  // Electrical & AC
  { id: 21, name: "AC Gas Top-up", rate: 800 },
  { id: 22, name: "AC Compressor Repair", rate: 2500 },
  { id: 23, name: "Electrical Diagnostics (Scanning)", rate: 500 },
  { id: 24, name: "Battery Replacement", rate: 200 },
  { id: 25, name: "Alternator Repair", rate: 3000 },
  { id: 26, name: "Starter Motor Repair", rate: 2800 },
  { id: 27, name: "Wiring Harness Repair", rate: 1500 },

  // Body & Tyres
  { id: 28, name: "Tyre Puncture Repair", rate: 150 },
  { id: 29, name: "Tyre Replacement (Per Tyre)", rate: 200 },
  { id: 30, name: "Dent Painting (Minor)", rate: 1500 },
  { id: 31, name: "Dent Painting (Major)", rate: 3500 },
  { id: 32, name: "Bumper Repair", rate: 2500 },
  { id: 33, name: "Windshield Replacement", rate: 2000 },
  { id: 34, name: "Headlight Restoration", rate: 800 },
  
  // Miscellaneous
  { id: 35, name: "Towing Service", rate: 1000 },
  { id: 36, name: "Pickup & Drop Service", rate: 600 },
  { id: 37, name: "Rust Protection Coating", rate: 3500 },
  { id: 38, name: "Ceramic Coating", rate: 8000 },
];

// Expanded Data for Parts
export const partsList = [
  // Oils & Fluids
  { id: 1, name: "Engine Oil (Mineral 5W30) - 1L", price: 350 },
  { id: 2, name: "Engine Oil (Synthetic 5W40) - 1L", price: 650 },
  { id: 3, name: "Engine Oil (Diesel 15W40) - 1L", price: 400 },
  { id: 4, name: "Oil Filter (Standard)", price: 150 },
  { id: 5, name: "Oil Filter (Premium)", price: 350 },
  { id: 6, name: "Air Filter", price: 450 },
  { id: 7, name: "Cabin Filter (AC)", price: 350 },
  { id: 8, name: "Fuel Filter", price: 550 },
  { id: 9, name: "Coolant (Concentrate) - 1L", price: 300 },
  { id: 10, name: "Brake Fluid (DOT3) - 500ml", price: 200 },
  { id: 11, name: "Brake Fluid (DOT4) - 500ml", price: 350 },
  { id: 12, name: "Transmission Oil (Gear Oil)", price: 600 },
  { id: 13, name: "Power Steering Fluid", price: 400 },
  { id: 14, name: "AC Gas (R134a) - Can", price: 650 },

  // Ignition & Electrical
  { id: 15, name: "Spark Plug (Standard)", price: 180 },
  { id: 16, name: "Spark Plug (Iridium)", price: 450 },
  { id: 17, name: "Glow Plug (Diesel)", price: 350 },
  { id: 18, name: "Ignition Coil", price: 850 },
  { id: 19, name: "Car Battery (35Ah)", price: 3500 },
  { id: 20, name: "Car Battery (45Ah)", price: 4500 },
  { id: 21, name: "Car Battery (60Ah)", price: 5500 },
  { id: 22, name: "Car Battery (100Ah SUV)", price: 8500 },
  { id: 23, name: "Headlight Bulb (Halogen H4)", price: 150 },
  { id: 24, name: "Headlight Bulb (Halogen H7)", price: 180 },
  { id: 25, name: "LED Headlight Kit", price: 2500 },
  { id: 26, name: "Fog Light Bulb", price: 200 },
  { id: 27, name: "Tail Light Bulb", price: 50 },
  { id: 28, name: "Wiper Blade (Pair)", price: 450 },
  { id: 29, name: "Horn (Standard)", price: 400 },
  { id: 30, name: "Horn (Windtone)", price: 1200 },
  { id: 31, name: "Fuse Set (Assorted)", price: 100 },
  { id: 32, name: "Relay (12V)", price: 150 },

  // Braking System
  { id: 33, name: "Brake Pad Set (Front - Ceramic)", price: 1500 },
  { id: 34, name: "Brake Pad Set (Rear)", price: 1200 },
  { id: 35, name: "Brake Shoe Set (Drum)", price: 800 },
  { id: 36, name: "Brake Disc (Rotor) - Single", price: 2200 },
  { id: 37, name: "Brake Drum - Single", price: 1800 },
  { id: 38, name: "Brake Caliper Repair Kit", price: 500 },

  // Suspension & Steering
  { id: 39, name: "Shock Absorber (Gas)", price: 2200 },
  { id: 40, name: "Shock Absorber (Oil)", price: 1600 },
  { id: 41, name: "Coil Spring", price: 1500 },
  { id: 42, name: "Control Arm (Ball Joint)", price: 1800 },
  { id: 43, name: "Tie Rod End", price: 650 },
  { id: 44, name: "Stabilizer Link", price: 450 },

  // Belts & Chains
  { id: 45, name: "Timing Belt", price: 900 },
  { id: 46, name: "Timing Chain Kit", price: 4500 },
  { id: 47, name: "V-Belt (Fan Belt)", price: 250 },
  { id: 48, name: "Serpentine Belt", price: 550 },

  // Major Parts
  { id: 49, name: "Clutch Kit (Cover + Disc + Bearing)", price: 4500 },
  { id: 50, name: "Alternator (New)", price: 6500 },
  { id: 51, name: "Starter Motor (New)", price: 5500 },
  { id: 52, name: "AC Compressor", price: 8000 },
  { id: 53, name: "Radiator", price: 4500 },
  { id: 54, name: "Condenser (AC)", price: 3000 },
  { id: 55, name: "Water Pump", price: 2500 },
  { id: 56, name: "Thermostat", price: 450 },
  
  // Accessories
  { id: 57, name: "Floor Mats (Set)", price: 1000 },
  { id: 58, name: "Seat Covers (Leather)", price: 12000 },
  { id: 59, name: "Car Perfume", price: 250 },
  { id: 60, name: "Phone Mount", price: 300 },
];

// 3. NEW: Vehicle Brand & Models List
export const vehicleModels = [
  { 
    brand: "TATA", 
    models: ["Tiago", "Tigor", "Altroz", "Nexon", "Harrier", "Safari", "Punch", "Curvv", "Hexa"] 
  },
  { 
    brand: "Mahindra", 
    models: ["Bolero", "Scorpio", "Scorpio-N", "XUV300", "XUV500", "XUV700", "Thar", "Bolero Neo", "Marazzo"] 
  },
  { 
    brand: "Maruti Suzuki", 
    models: ["Alto", "WagonR", "Swift", "Dzire", "Baleno", "Brezza", "Ertiga", "XL6", "Ciaz", "Jimny", "Grand Vitara"] 
  },
  { 
    brand: "Hyundai", 
    models: ["i10", "Grand i10 Nios", "i20", "Aura", "Verna", "Venue", "Creta", "Tucson", "Exter", "Alcazar"] 
  },
  { 
    brand: "Honda", 
    models: ["Amaze", "City", "WR-V", "Jazz", "Elevate"] 
  },
  { 
    brand: "Toyota", 
    models: ["Innova Crysta", "Fortuner", "Camry", "Glanza", "Urban Cruiser", "Innova Hycross", "Hilux"] 
  },
  { 
    brand: "Kia", 
    models: ["Seltos", "Sonet", "Carens", "Carnival", "EV6"] 
  },
  { 
    brand: "Volkswagen", 
    models: ["Polo", "Virtus", "Taigun", "Tiguan"] 
  },
  { 
    brand: "Renault", 
    models: ["Kwid", "Triber", "Kiger", "Duster"] 
  },
  { 
    brand: "MG", 
    models: ["Hector", "Astor", "Gloster", "ZS EV", "Comet EV"] 
  },
  { 
    brand: "Skoda", 
    models: ["Rapid", "Slavia", "Kushaq", "Kodiaq"] 
  },
  { 
    brand: "Nissan", 
    models: ["Magnite", "Kicks"] 
  },
  { 
    brand: "Jeep", 
    models: ["Compass", "Meridian", "Wrangler", "Grand Cherokee"] 
  },
];