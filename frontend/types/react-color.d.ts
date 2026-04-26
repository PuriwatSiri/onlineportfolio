declare module 'react-color' {
  import React from 'react';

  interface ColorResult {
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
      a: number;
    };
  }

  interface SketchPickerProps {
    color?: string;
    onChangeComplete?: (color: ColorResult) => void;
    onChange?: (color: ColorResult) => void;
  }

  export const SketchPicker: React.FC<SketchPickerProps>;
}
