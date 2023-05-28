import { definePreparserSetup } from '@slidev/types';
import fs from 'node:fs';

function readLinesFromFile(path: string): string[] {
    return fs.readFileSync(path)
      .toString()
      .split('\n')
      // remove trailing newline
      .slice(0, -1);
}

export default definePreparserSetup(() => {
  return {
      transformRawLines(lines) {
        let i = 0;
        while (i < lines.length) {
          const match = lines[i].match(/^@src: (.*)$/);
          if (match) {
            const fileLines = readLinesFromFile(match[1]);
            lines.splice(i, 1, ...fileLines);
          }

          const match2 = lines[i].match(/^@src-quot: (.*)$/);
          if (match2) {
            const fileLines = readLinesFromFile(match2[1]);
            const quotedLines = fileLines.map(
              line => line.replace(/\"/g, '&quot;')
            );
            lines.splice(i, 1, ...quotedLines);
          }
          i++;
        }
      },
      name: 'includeSnippet',
  }
});

