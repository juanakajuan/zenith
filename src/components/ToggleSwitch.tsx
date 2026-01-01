import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="toggle-switch-wrapper">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`toggle-switch ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        type="button"
      >
        <span className="toggle-switch-track">
          <span className="toggle-switch-thumb" />
        </span>
      </button>
    </div>
  );
}
