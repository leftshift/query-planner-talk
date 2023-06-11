# Postgres Query Planning Slides
Slides for my [GPN21 talk](https://media.ccc.de/v/gpn21-195-introduction-to-postgres-query-planning).

## This is not a place of honor…
no highly esteemed deed is commemorated here… nothing valued is here.

No, seriously, there are some ugly hacks in the sources for these slides. Much time was wasted. Some of my favorites:
* mermaid.js css fix in `setup/mermaid.ts` to avoid clipping text
* some unholy preparser include macros in `setup/preparser.ts`
    * most notably, `@src-quot` which escapes " as &amp;quot;. The vue people told me to just do this and not worry about it.
    * also unfortunately this kinda breaks the live editing of slide content or speaker nodes from the frontend as it expands these before writing back the file.
* a namespaced bootstrap.css which just applies inside the `.bootstrap` class.
    * pev2 requires bootstrap styles, but they conflict with the default windicss styles
* something in pev2 mislayouts the graph in some cases.
    * directly loading a slide or prerendering it
        * the svg gets an offset of `NaN, NaN` applied and just fucks right off into nirvana
        * setting `preload: false` seems to at least alleviate the second issue
    * also the lines sometimes end up in the wrong place and it scrolls weird
        * probably related to transforms slidev applies, zooming the window to ~150% seems to help

## To start the slide show:

- `npm install`
- `npm run dev`
- visit http://localhost:3030

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev on [documentations](https://sli.dev/).
