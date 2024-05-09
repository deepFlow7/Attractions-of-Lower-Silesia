import React, { useState } from 'react';

interface FilterProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option}>
          <input
            type="checkbox"
            id={option}
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default Filter;
