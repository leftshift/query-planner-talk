import css from 'css';
import fs from 'fs';

const PREFIX = '.bootstrap';

type CssNode = css.Rule|css.AtRule|css.Comment;

function addPrefix(node: CssNode): CssNode {
  if (node.type == 'rule') {
    const rule: css.Rule = node;
    rule.selectors = rule.selectors!.map(selector => PREFIX + ' ' + selector)
    return rule;
  }

  if (node.type == 'media') {
    const mediaRule: css.Media = node;
    mediaRule.rules = mediaRule.rules!.map(addPrefix);
    return mediaRule;
  }

  return node;
}

function addScope(input: string) {
  const parsed = css.parse(input, {
    source: './bootstrap.css'
  });

  parsed.stylesheet!.rules = parsed.stylesheet!.rules.map(rule => {
    return addPrefix(rule)
  });
  return parsed;
}

const input = fs.readFileSync('bootstrap.css').toString();
const outSheet = addScope(input);

fs.writeFileSync('bootstrap-scoped.css', css.stringify(outSheet));
