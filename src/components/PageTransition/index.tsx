import { motion } from "motion/react";

export function PageTransition({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
}