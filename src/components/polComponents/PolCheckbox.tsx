import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Checkbox } from "@nextui-org/react";
import LiveChangeIndicator from "../LiveChangeIndicator";

interface Props {
  children?: ReactNode;
  value?: boolean;
  onValueChanged?: (isChecked: boolean) => void;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const PolCheckbox = ({ children, onClick, value: isChecked = false, onValueChanged, className, disabled }: Props) => {
  const handleChange = () => {
    if (disabled) return;
    onValueChanged && onValueChanged(!isChecked);
  };

  return (
    <LiveChangeIndicator value={isChecked}>
      <div className={className}>
        <Checkbox onClick={onClick} isSelected={isChecked} onValueChange={handleChange} color="primary">
          {children && children}
        </Checkbox>
      </div>
    </LiveChangeIndicator>
  );
};

export default PolCheckbox;
