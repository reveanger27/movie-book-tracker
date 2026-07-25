import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8}}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut"}}
          >
            <Outlet />   {/* <- di sinilah Dashboard/ItemForm/dst nanti "disisipkan" */}
          </motion.div>
      </AnimatePresence>

    </div>
  );
}

export default Layout;