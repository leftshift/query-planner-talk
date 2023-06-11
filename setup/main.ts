import { defineAppSetup } from '@slidev/types'
import { Plan } from 'pev2'
import "pev2/dist/style.css"
import "@fontsource/pt-serif/400.css"
import "@fontsource/pt-serif/700.css"
import "@fontsource/pt-mono/400.css"

export default defineAppSetup(({ app, router }) => {
  console.log('hello')
  app.component('pev2', Plan);
})
