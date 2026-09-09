import { useState } from "react";
import type { OperationalSettings as OperationalSettingsType } from "../../types/settings";

interface OperationalSettingsProps {
  settings: OperationalSettingsType | null,
  onSaved: () => void
}

export default function OperationalSettings ({
  settings,
  onSaved,
}: OperationalSettingsProps) {

  const DAYS = [
    { value: 1, label: "Sen" },
    { value: 2, label: "Sel" },
    { value: 3, label: "Rab" },
    { value: 4, label: "Kam" },
    { value: 5, label: "Jum" },
    { value: 6, label: "Sab" },
    { value: 7, label: "Min" },
  ];

  const [operatingDays, setOperatingDays] = useState<number[]>([])

  console.log(settings, onSaved)

  return (
    <div className="settings-days">
      {DAYS.map((day) => {
        const active = operatingDays.includes(day.value);

        return (
          <button
            key={day.value}
            type="button"
            className={`settings-day ${active ? "is-active" : ""}`}
            onClick={() => {
              setOperatingDays((current) =>
                current.includes(day.value)
                  ? current.filter((value) => value !== day.value)
                  : [...current, day.value].sort((a, b) => a - b)
              );
            }}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  )

}