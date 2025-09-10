"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CollapseProps {
  open: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

/**
 * Bootstrap-like Collapse primitive using framer-motion
 * usage: <Collapse open={boolean} className="..."> ... </Collapse>
 */
export function Collapse({ open, children, duration = 0.35, className }: CollapseProps) {
  return (
    <AnimatePresence initial={false} mode="sync">
      {open ? (
        <motion.div
          key="collapse"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
          className={"overflow-hidden " + (className ?? "")}
          data-state={open ? "open" : "closed"}
        >
          <div className="py-2">{children}</div>
        </motion.div>
      ) : (
        <motion.div
          key="collapse-ghost"
          initial={false}
          animate={{ height: 0, opacity: 0 }}
          style={{ overflow: "hidden" }}
          data-state="closed"
        />
      )}
    </AnimatePresence>
  );
}
