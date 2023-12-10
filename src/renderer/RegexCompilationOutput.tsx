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

// eslint-disable-next-line consistent-return
const outputColor = (output: CompilationOutput): string => {
  // eslint-disable-next-line default-case
  switch (output.state) {
    case 'ok':
      return 'darkgreen';
    case 'empty':
      return 'lightgray';
    case 'error':
      return 'darkred';
  }
};

const RegexCompilationOutputComponent = memo(({ output }: Props) => {
  let message: string;
  // eslint-disable-next-line default-case
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
    case 'error':
      message = output.message;
      break;
  }

  return (
    <p className="compilation-output" style={{ color: outputColor(output) }}>
      {message}
    </p>
  );
});

export default RegexCompilationOutputComponent;
