import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  console.log('hello')
  return {
    theme: "forest",
    fontFamily: '"Fira Sans"',
    // fontSize: 24, // doesn't work ://

    // This is needed for <sub> elements to render correctly and not clip.
    // My hunch: this is the default styling used in html, whereas some
    // slightly different default style is used in svg contexts.
    // Mermaid measures the html element and then drops it into the svg,
    // resulting in different sizes?
    themeCSS: `
      sub { font-size: 75% }
    `
  }
});
