import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Path = (props) => (
  <motion.path
    animate={props.isOpen ? "open" : "closed"}
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

const Button = styled.button`
  outline: none;
  border: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: pointer;
  border-radius: 50%;
  background: transparent;
`;

export const MenuToggle = ({ toggle, isOpen }) => (
  <Button onClick={toggle} className="z-[100000] p-2">
    <svg width="23" height="23" className="stroke-black dark:stroke-white" viewBox="0 0 22 18">
      <Path
        isOpen={isOpen}
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        isOpen={isOpen}
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        isOpen={isOpen}
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </Button>
);
