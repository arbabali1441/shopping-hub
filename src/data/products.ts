export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  badge?: string;
  longDescription?: string;
  specs?: { label: string; value: string }[];
  reviews?: Review[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ergonomic Executive Desk Chair",
    category: "Furniture",
    price: 1280,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1000&q=80",
    description: "Premium breathable mesh office chair with lumbar support and 3D armrests.",
    longDescription: "Designed for long hours of seating comfort in executive offices. Engineered with breathable mesh material, active lumbar support, adjustable headrest, and heavy-duty aluminum base.",
    features: ["Dynamic Lumbar Support System", "3D Adjustable Armrests", "High-Grade Italian Breathable Mesh", "Heavy-Duty Aluminum Base (Up to 150kg)"],
    specs: [{ label: "Material", value: "Mesh & Aluminum Frame" }, { label: "Weight Capacity", value: "150 kg" }, { label: "Warranty", value: "5 Years Warranty" }, { label: "Recline Angle", value: "90° - 135°" }],
    badge: "Bestseller",
    reviews: [
      { id: "r1", author: "Ahmed R.", rating: 5, date: "2 days ago", comment: "Excellent ergonomics! Saved my back during long work sessions." },
      { id: "r2", author: "Sarah K.", rating: 4, date: "1 week ago", comment: "Very sturdy build quality. Highly recommended for home office." }
    ]
  },
  {
    id: 2,
    name: "Acoustic Studio ANC Headphones",
    category: "Electronics",
    price: 1099,
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    description: "High-fidelity wireless studio headphones with active noise cancellation and 40-hour battery life.",
    longDescription: "Experience pure sound quality on the go. Custom-tuned 40mm drivers deliver rich bass and clear highs with hybrid active noise cancellation.",
    features: ["Hybrid ANC Noise Reduction (-38dB)", "40 Hours Battery Life", "Bluetooth 5.3 & Low Latency Mode", "Fast Type-C Charging (10 mins = 5 hrs)"],
    specs: [{ label: "Driver Size", value: "40mm Beryllium" }, { label: "Battery", value: "40 Hours (ANC ON)" }, { label: "Connectivity", value: "Bluetooth 5.3 / 3.5mm Jack" }, { label: "Weight", value: "240g" }],
    badge: "Top Rated",
    reviews: [
      { id: "r3", author: "Tariq M.", rating: 5, date: "3 days ago", comment: "Noise cancellation is amazing. Crisp clarity and deep bass." }
    ]
  },
  {
    id: 3,
    name: "Solid Oak Scandinavian Dining Table",
    category: "Furniture",
    price: 3299,
    rating: 4.7,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80",
    description: "Handcrafted solid European oak dining table with minimalist Nordic design.",
    longDescription: "Crafted from sustainably sourced solid oak wood with natural grain patterns, perfect for modern villa and apartment dining spaces.",
    features: ["100% Solid European Oak Wood", "Seats up to 8 adults comfortably", "Scratch & Stain Resistant Matte Finish", "Eco-Friendly Sustainable Timber"],
    specs: [{ label: "Dimensions", value: "200cm x 90cm x 75cm" }, { label: "Wood Type", value: "European Solid Oak" }, { label: "Seating Capacity", value: "6 - 8 Persons" }, { label: "Assembly", value: "Free In-Home Assembly" }],
    badge: "Luxury Edition",
    reviews: [
      { id: "r4", author: "Zayd N.", rating: 5, date: "5 days ago", comment: "Beautiful finish and solid wood texture. Fits our dining space perfectly." }
    ]
  },
  {
    id: 4,
    name: "Ultra-Thin Mechanical Keyboard",
    category: "Electronics",
    price: 450,
    rating: 4.6,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    description: "Low profile wireless mechanical keyboard with RGB backlighting.",
    longDescription: "Precision typing experience with ultra-tactile low profile mechanical switches and seamless multi-device connection.",
    features: ["Hot-swappable Low Profile Switches", "RGB Dynamic Backlighting", "Triple Mode: Bluetooth / 2.4G / Type-C"],
    specs: [{ label: "Switch Type", value: "Gateron Low Profile Red" }, { label: "Battery", value: "3000 mAh" }],
    badge: "Trending",
    reviews: [
      { id: "r5", author: "Faisal A.", rating: 4, date: "2 weeks ago", comment: "Very tactile feel, keys are silent and responsive." }
    ]
  },
  {
    id: 5,
    name: "Minimalist Ambient Desk Lamp",
    category: "Home & Living",
    price: 299,
    rating: 4.8,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    description: "Smart LED desk lamp with touch dimming and wireless phone charging base.",
    longDescription: "Sleek matte finish aluminum lamp with eye-care diffuse lighting and integrated fast wireless charger.",
    features: ["QI Wireless Charging Pad Built-in", "Touch Control Color Temperature", "Eye-Protection Soft LED Panel"],
    specs: [{ label: "Power Output", value: "15W Wireless + 10W USB" }, { label: "Color Temp", value: "2700K - 6500K" }],
    badge: "New Arrival",
    reviews: [
      { id: "r6", author: "Hassan S.", rating: 5, date: "1 month ago", comment: "Love the wireless charging feature on the base!" }
    ]
  }
];
