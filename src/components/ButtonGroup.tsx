import { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
}

export default function ButtonGroup({ children }: ButtonGroupProps) {
  return <div role="group">{children}</div>;
}
