import { defineAppSetup } from '@slidev/types'
import { Plan } from 'pev2';
import "pev2/dist/style.css"

export default defineAppSetup(({ app, router }) => {
  console.log('hello')
  app.component('pev2', Plan);
})
