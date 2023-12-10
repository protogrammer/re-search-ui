import React, { memo } from 'react';

type RegexOption = 'i' | 'm' | 's' | 'u' | 'v' | 'y';

const removeConflictingOptions = (
  options: RegexOption[],
  option: RegexOption,
): RegexOption[] => {
  if (option === 'u') return options.filter((o) => o !== 'v');
  if (option === 'v') return options.filter((o) => o !== 'u');
  return options;
};

export class RegexOptions {
  #options: RegexOption[];

  constructor(options: RegexOption[] = []) {
    this.#options = options.slice();
  }

  includes(option: RegexOption): boolean {
    return this.#options.includes(option);
  }

  addOption(option: RegexOption): RegexOptions {
    if (this.includes(option)) return this;
    return new RegexOptions([
      ...removeConflictingOptions(this.#options, option),
      option,
    ]);
  }

  removeOption(option: RegexOption): RegexOptions {
    return new RegexOptions(this.#options.filter((x) => x !== option));
  }

  toString(): string {
    return this.#options.join('');
  }
}

type Props = {
  options: RegexOptions;
  setOptions: React.Dispatch<React.SetStateAction<RegexOptions>>;
};

type OptionProps = Props & {
  flag: RegexOption;
  name: string;
};

const OptionComponent = memo(
  ({ flag, name, options, setOptions }: OptionProps) => {
    return (
      <p className="regex-option">
        <input
          type="checkbox"
          checked={options.includes(flag)}
          onChange={(e) => {
            setOptions(
              e.target.checked
                ? options.addOption(flag)
                : options.removeOption(flag),
            );
          }}
        />{' '}
        {name}
      </p>
    );
  },
);

const RegexOptionsComponent = memo(({ options, setOptions }: Props) => {
  return (
    <>
      <OptionComponent
        flag="i"
        name="Ignore case"
        options={options}
        setOptions={setOptions}
      />
      <OptionComponent
        flag="m"
        name="Multiline"
        options={options}
        setOptions={setOptions}
      />
      <OptionComponent
        flag="s"
        name="Dot all"
        options={options}
        setOptions={setOptions}
      />
      <OptionComponent
        flag="u"
        name="Unicode mode"
        options={options}
        setOptions={setOptions}
      />
      <OptionComponent
        flag="v"
        name="Extended unicode mode"
        options={options}
        setOptions={setOptions}
      />
      <OptionComponent
        flag="y"
        name="Sticky mode"
        options={options}
        setOptions={setOptions}
      />
    </>
  );
});

export default RegexOptionsComponent;
