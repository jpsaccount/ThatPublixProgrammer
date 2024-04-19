import PolSpinner from "@/components/polComponents/PolSpinner";
import { Fade } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  isLoading: boolean;
  children: ReactNode;
  onLoading?: () => ReactNode;
}

export default function PolLoadingSection({ isLoading, children, onLoading }: Props) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div key={1} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          {onLoading ? (
            onLoading()
          ) : (
            <Fade className="grid" style={{ gridColumn: 1, gridRow: 1 }} in={isLoading}>
              <PolSpinner className="m-auto" IsLoading={isLoading} />
            </Fade>
          )}
        </motion.div>
      )}
      {isLoading === false && (
        <motion.div key={2} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
