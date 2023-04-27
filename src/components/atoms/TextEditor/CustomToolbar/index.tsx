import React from 'react';
import formats from './ToolbarOptions.js';

const renderOptions = (formatData: any, idx: number) => {
  const { className, options } = formatData;
  return (
    <select key={idx} className={className}>
      <option></option>
      {
        options.map((value: any, i: number) => (
          <option key={i} value={value}></option>
        ))
      }
    </select>
  );
};
const renderSingle = (formatData: any, idx: number) => {
  const { className, value } = formatData;
  return (
    <button key={idx} className={className} value={value}></button>
  );
};

interface Props {
  className?: string;
}

const CustomToolbar = ({ className }: Props) => (
  <div id={`toolbar_${className}`}>
    {
      formats.map((classes, i) => (
        <span key={i} className="ql-formats">
          {
            classes.map((formatData: any, idx: number) => formatData?.options ? renderOptions(formatData, idx) : renderSingle(formatData, idx))
          }
        </span>
      ))
    }
  </div>
);
export default CustomToolbar;
