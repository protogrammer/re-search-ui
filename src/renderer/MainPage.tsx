import React, { useState, useEffect, memo } from 'react';

import SearchRegexInputComponent from './SearchRegexInput';
import RegexOptionsComponent, { RegexOptions } from './RegexOptions';
import RegexCompilationOutputComponent from './RegexCompilationOutput';
import type { CompilationOutput } from './RegexCompilationOutput';
import ContentTextComponent from './ContentText';
import './MainPage.css';

const MainPageComponent = memo(() => {
  const [regexText, setRegexText] = useState<string>('');
  const [matches, setMatches] = useState<[number, number][] | null>(null);
  const [contentText, setContentText] = useState<
    string | { err: string } | null
  >(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [compilationOutput, setCompilationOutput] = useState<CompilationOutput>(
    {
      state: 'empty',
    },
  );
  const [regexOptions, setRegexOptions] = useState<RegexOptions>(
    new RegexOptions(),
  );

  useEffect(
    () =>
      window.electron.onFileOpen(([value, newFilename]) => {
        setContentText('err' in value ? value : value.ok);
        setFilename(newFilename);
      }),
    [],
  );

  useEffect(() => {
    let canceled = false;

    setTimeout(async () => {
      if (canceled) return;
      if (regexText.length === 0) {
        setMatches(null);
        setCompilationOutput({
          state: 'empty',
        });
        return;
      }
      const result = await window.electron.searchRegex(
        regexText,
        `dg${regexOptions}`,
        filename,
      );
      if (canceled) return;
      if (result.state === 'err') {
        setMatches(null);
        setCompilationOutput({
          state: 'error',
          message: result.message,
        });
        return;
      }
      setMatches(result.matches);
      setCompilationOutput({
        state: 'ok',
        matchesCount: result.matches?.length,
      });
    }, 500);

    return () => {
      canceled = true;
    };
  }, [regexText, regexOptions, contentText, filename]);

  return (
    <div className="main-page-div">
      <div className="main-page-left-div">
        <SearchRegexInputComponent
          regexText={regexText}
          setRegexText={setRegexText}
        />
        <RegexOptionsComponent
          options={regexOptions}
          setOptions={setRegexOptions}
        />
      </div>
      <div className="main-page-right-div">
        <RegexCompilationOutputComponent output={compilationOutput} />
        <ContentTextComponent text={contentText} matches={matches} />
      </div>
    </div>
  );
});

export default MainPageComponent;
