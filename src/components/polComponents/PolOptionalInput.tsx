import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolInput from "@/components/polComponents/PolInput";

interface Props {
  isEditing: boolean;
  isMultiline?: boolean;
  label: string;
  className?: string;
  value: string;
  onValueChanged: (value) => void;
}

export function PolOptionalInput({ isEditing, label, value, onValueChanged, className, isMultiline = false }: Props) {
  if (isEditing) {
    return (
      <PolInput
        label={label}
        type="text"
        value={value}
        isMultiline={isMultiline}
        className={className}
        onValueChanged={onValueChanged}
      />
    );
  }

  return (
    <LabelSection label={label}>
      <span className={className}>{value}</span>
    </LabelSection>
  );
}
