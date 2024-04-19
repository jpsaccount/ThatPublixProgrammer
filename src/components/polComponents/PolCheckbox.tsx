import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Checkbox } from "@nextui-org/react";

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
    <div className={className}>
      <Checkbox onClick={onClick} isSelected={isChecked} onValueChange={handleChange} color="primary">
        {children && children}
      </Checkbox>
    </div>
  );
};

export default PolCheckbox;
