import { definePreparserSetup } from '@slidev/types';
import fs from 'node:fs';

export default definePreparserSetup(() => {
  return {
      transformRawLines(lines) {
        let i = 0;
        while (i < lines.length) {
          const match = lines[i].match(/^@src: (.*)$/);
          if (match) {
            const fileLines = fs.readFileSync(match[1])
              .toString()
              .split('\n');
            lines.splice(i, 1, ...fileLines);
          }
          i++;
        }
      },
      name: 'includeSnippet',
  }
});

