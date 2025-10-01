import { motion } from "framer-motion";
import { useRef, useState } from "react";

import inventoryImg from "./assets/img/layout/inventory.webp";
import employeeImg from "./assets/img/layout/employee.webp";
import orderImg from "./assets/img/layout/order.webp";
import deliveryImg from "./assets/img/layout/delivery.webp";
import trackingImg from "./assets/img/layout/tracking.webp";
import featuresImg from "./assets/img/layout/features.webp";
import monitorImg from "./assets/img/layout/computer_with_icons.jpg";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
function HeroNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute left-0 right-0 top-6 z-40 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between shadow p-5 bg-white rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            R
          </div>
          <div className="font-semibold text-gray-800">Restro</div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <a href="#home" className="hover:text-gray-900">
            Home
          </a>
          <a href="#features" className="hover:text-gray-900">
            Features
          </a>
          <a href="#pricing" className="hover:text-gray-900">
            Pricing
          </a>
          <a href="#contact" className="hover:text-gray-900">
            Contact
          </a>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 bg-white bg-opacity-60 rounded-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H21"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H21"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 18H21"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {open && (
          <div className="absolute right-6 top-16 bg-white rounded-lg shadow-lg py-3 px-4 w-48 flex flex-col gap-2">
            <a href="#home" className="text-gray-700">
              Home
            </a>
            <a href="#features" className="text-gray-700">
              Features
            </a>
            <a href="#pricing" className="text-gray-700">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700">
              Contact
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const services = [
  {
    id: 1,
    title: "Inventory Management",
    description:
      "Keep track of stock levels, expiry dates, and automatic reorder alerts – ensuring you never run out of essentials.",
    img: inventoryImg,
    bg: "bg-gradient-to-b from-white via-gray-50 to-gray-200", // ✅ already good
    link: "/admin/inventory/overview",
  },
  {
    id: 2,
    title: "Employee Management",
    description:
      "Assign roles, shifts, and monitor performance easily with intuitive tools tailored for restaurant teams.",
    img: employeeImg,
    bg: "bg-gradient-to-b from-white via-blue-50 to-blue-100", // ✅ soft and light
    link: "/admin/employees/overview",
  },
  {
    id: 3,
    title: "Order Management",
    description:
      "Streamline order flow from kitchen to customer with real-time updates, ensuring seamless operations.",
    img: orderImg,
    bg: "bg-gradient-to-b from-white via-gray-100 to-gray-200", // ✅ subtle and premium
    link: "/admin/orders/create",
  },
  {
    id: 4,
    title: "Delivery Tracking",
    description:
      "Track deliveries in real time with GPS updates and estimated arrival times for better customer satisfaction.",
    img: deliveryImg,
    bg: "bg-gradient-to-b from-white via-gray-50 to-gray-150", // ✅ clean and barely tinted
    link: "/admin/delivery/rider-tracking",
  },
  {
    id: 5,
    title: "Order Tracking",
    description:
      "Let your customers track their orders easily, reducing calls and improving satisfaction.",
    img: trackingImg,
    bg: "bg-gradient-to-b from-white via-gray-50 to-gray-200", // ✅ already good
    link: "/admin/delivery/order-tracking",
  },
  {
    id: 6,
    title: "More Features Coming Soon",
    description:
      "We’re always improving. Stay updated with new tools designed to help your restaurant grow.",
    img: featuresImg,
    bg: "bg-gradient-to-b from-white via-purple-50 to-purple-100", // ✅ soft purple tone, premium but subtle
  },
];
// Define workflow points for each service
const workflowPoints = {
  1: [
    "Monitor stock levels daily to avoid shortages.",
    "Set reorder alerts automatically based on usage patterns.",
    "Track expiry dates to reduce waste.",
    "Generate reports for better inventory planning.",
  ],
  2: [
    "Assign roles and permissions clearly.",
    "Manage shifts and schedules efficiently.",
    "Track employee performance regularly.",
    "Send reminders for upcoming tasks or deadlines.",
  ],
  3: [
    "Manage orders from kitchen to customer smoothly.",
    "Provide real-time updates on order status.",
    "Ensure timely order fulfillment every time.",
    "Handle order modifications quickly and easily.",
  ],
  4: [
    "Track deliveries in real time using GPS.",
    "Provide accurate estimated arrival times.",
    "Improve customer satisfaction with faster service.",
    "Notify customers of delays instantly.",
  ],
  5: [
    "Let customers track orders easily online.",
    "Reduce support calls with self-service tools.",
    "Enhance customer experience with transparency.",
    "Offer updates via email or app notifications.",
  ],
  6: [
    "Release new features regularly for better management.",
    "Optimize operations with smart tools.",
    "Stay ahead with improved processes.",
    "Collect feedback to refine services further.",
  ],
};

export default function LandingPageScreen() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div
      ref={scrollRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {/* Hero Section */}
      <section className="w-full h-screen bg-gradient-to-r from-gray-100 to-gray-50 flex flex-col-reverse md:flex-row items-center justify-center  !px-8 md:!px-20 snap-start relative">
        {/* Inline navbar for hero (full-width, not fixed) */}
        {/* <HeroNav /> */}
        {/* Left Text Area */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 !space-y-2"
        >
          <h1 className="!text-4xl md:!text-5xl !font-bold !leading-snug text-gray-700">
            Restro - Smarter Restaurant Management
          </h1>
          <p className="!text-lg md:!text-xl text-gray-400">
            Effortless control over inventory, staff, orders, and deliveries –
            all in one place.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-10">
            <button
              className="!px-6 !py-3 !text-white !bg-gray-700 !font-semibold rounded-lg shadow hover:!bg-gray-600 transition-colors"
              onClick={() => navigate("/admin/dashboard/default")}
            >
              Get Started
            </button>
            <button className="!px-6 !py-3 !text-gray-700 !border !border-gray-200 rounded-lg !bg-gray-100 hover:!bg-gray-50 hover:!text-blue-700 transition-colors">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right Image Area */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 mt-8 md:mt-0 flex justify-center items-center"
        >
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            <img
              src={monitorImg}
              alt="Dashboard Illustration"
              className="w-full h-full object-contain scale-125"
            />
          </div>
        </motion.div>
      </section>
      {/* Service Sections */}
      {services.map((service, index) => {
        const isEven = index % 2 === 0;
        const layout = isEven ? "flex-row" : "flex-row-reverse";
        const circlePosition = !isEven
          ? "-left-50 lg:-top-35"
          : "-right-50 lg:-top-35";
        const isMobile = window.innerWidth < 768;

        return (
          <section
            key={service.id}
            className={`w-full h-full ${service.bg} flex ${layout}  justify-between items-center relative overflow-hidden snap-start gap-10`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: isMobile ? 0 : 0.8,
              }}
              className={`lg:bg-white shadow-lg !opacity-50 blur-[0.5px] set-10 lg:blur-none lg:!opacity-100 lg:rounded-full h-[100vh] w-[100vh] flex items-center justify-center text-center absolute ${circlePosition} top-0`}
            >
              <img
                src={service.img}
                alt={`${service.title} visual`}
                className="w-full !h-full object-cover lg:rounded-full"
              />
            </motion.div>

            <motion.div
              initial={{ x: isEven ? 100 : -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full lg:max-w-xl px-10 lg:mx-30 z-50 h-full lg:h-fit lg:!bg-transparent bg-black/20 justify-center flex flex-col"
            >
              <h2 className="!text-5xl lg:!text-6xl !font-bold !mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                {service.description}
              </p>

              {/* Added Bullet Points for Workflow */}
              <ul className="list-disc list-inside text-gray-500 !mt-4 space-y-2 text-sm md:text-base">
                {workflowPoints[service.id].map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>

              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="!mt-6 !px-6 !py-3 !text-white !bg-gray-700 !mr-3 !font-semibold rounded-lg shadow hover:!bg-gray-600 transition-colors"
                  onClick={() => navigate(service.link || "/landing-page")}
                >
                  Learn More
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="!mt-6 !px-6 !py-3 !text-gray-700 !border !border-gray-200 rounded-lg !bg-gray-100 hover:!bg-gray-50 hover:!text-blue-700 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </section>
        );
      })}
      {/* Footer Section */}
      <section className="w-full h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-8 snap-start">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 mb-10">
          <div className="px-15">
            <h3 className="!text-xl !font-bold !mb-4">Company</h3>
            <ul>
              <li className="mb-2 hover:underline cursor-pointer">Press</li>
              <li className="mb-2 hover:underline cursor-pointer">About Us</li>
              <li className="mb-2 hover:underline cursor-pointer">Careers</li>
            </ul>
          </div>
          <div className="px-15">
            <h3 className="!text-xl !font-bold !mb-4">Support</h3>
            <ul>
              <li className="mb-2 hover:underline cursor-pointer">
                Help Center
              </li>
              <li className="mb-2 hover:underline cursor-pointer">
                Privacy Policy
              </li>
              <li className="mb-2 hover:underline cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>
          <div className="px-15">
            <h3 className="!text-xl !font-bold !mb-4">Contact</h3>
            <ul>
              <li className="mb-2 hover:underline cursor-pointer">
                support@restro.com
              </li>
              <li className="mb-2 hover:underline cursor-pointer">
                +49 123 456 789
              </li>
              <li className="mb-2 hover:underline cursor-pointer">
                Berlin, Germany
              </li>
            </ul>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          &copy; 2025 Restro. All rights reserved.
        </div>
      </section>
    </div>
  );
}
