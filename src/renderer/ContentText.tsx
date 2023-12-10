import React, { memo } from 'react';

import type { FileInfo } from '../main/declarations';

const RECURSION_LIMIT = 50_000;

type HighlightedProps = {
  text: string;
  matches: [number, number][] | null;
  i: number;
};

const HighlightedComponent = ({ text, matches, i }: HighlightedProps) => {
  if (!matches || matches.length === 0) {
    return text;
  }

  if (i === matches.length) {
    return text.substring(matches[i - 1][1]);
  }

  if (i > RECURSION_LIMIT) {
    // eslint-disable-next-line no-alert
    window.alert(`Too many matches. The latter ones may not be highlighted.`);
    return text.substring(matches[i - 1][1]);
  }

  return (
    <>
      {text.substring(i === 0 ? 0 : matches[i - 1][1], matches[i][0])}
      <span className="highlited-text">
        {text.substring(matches[i][0], matches[i][1])}
      </span>
      <HighlightedComponent text={text} matches={matches} i={i + 1} />
    </>
  );
};

const optimizeHighlitedMatches = (
  matches: [number, number][] | null,
): [number, number][] | null => {
  return (
    matches &&
    matches.reduce(
      (acc, [start, end]) => {
        if (acc.length !== 0 && acc[acc.length - 1][1] === start) {
          acc[acc.length - 1][1] = end;
        } else if (start !== end) {
          acc.push([start, end]);
        }
        return acc;
      },
      [] as [number, number][],
    )
  );
};

type Props = {
  fileInfo: FileInfo;
  matches: [number, number][] | null;
};

const textColor = (fileInfo: FileInfo) => {
  switch (fileInfo.state) {
    case 'opened':
      return 'black';
    case 'closed':
      return 'lightgray';
    default: // state === 'error'
      return 'darkred';
  }
};

const ContentTextComponent = memo(({ fileInfo, matches }: Props) => {
  return (
    <span
      className="content-text"
      style={{
        color: textColor(fileInfo),
      }}
    >
      {fileInfo.state !== 'closed' ? (
        <HighlightedComponent
          text={fileInfo.state === 'opened' ? fileInfo.text : fileInfo.message}
          matches={optimizeHighlitedMatches(matches)}
          i={0}
        />
      ) : (
        'No file opened'
      )}
    </span>
  );
});

export default ContentTextComponent;
