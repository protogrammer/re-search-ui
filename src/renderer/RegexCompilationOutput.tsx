import React, { memo } from 'react';

type Error = {
  state: 'error';
  message: string;
};
type Ok = {
  state: 'ok';
  matchesCount?: number;
};
type Empty = {
  state: 'empty';
};
export type CompilationOutput = Error | Ok | Empty;

type Props = {
  output: CompilationOutput;
};

const outputColor = (output: CompilationOutput): string => {
  switch (output.state) {
    case 'ok':
      return 'darkgreen';
    case 'empty':
      return 'lightgray';
    default: // state === 'error'
      return 'darkred';
  }
};

const RegexCompilationOutputComponent = memo(({ output }: Props) => {
  let message: string;
  switch (output.state) {
    case 'ok':
      message = 'ok';
      if (output.matchesCount != null)
        message += `, ${output.matchesCount} match${
          output.matchesCount === 1 ? '' : 'es'
        } found`;
      break;
    case 'empty':
      message = '<compilation-output>';
      break;
    default: // state === 'error'
      message = output.message;
  }

  return (
    <p className="compilation-output" style={{ color: outputColor(output) }}>
      {message}
    </p>
  );
});

export default RegexCompilationOutputComponent;
