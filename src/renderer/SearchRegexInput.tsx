import React, { memo } from 'react';

type Props = {
  regexText: string;
  setRegexText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchRegexInputComponent = memo(({ regexText, setRegexText }: Props) => {
  return (
    <p className="search-regex">
      <input
        type="text"
        placeholder="Search regex"
        value={regexText}
        onChange={(e) => setRegexText(e.target.value)}
      />
    </p>
  );
});

export default SearchRegexInputComponent;
