import { writable } from "svelte/store"

export const pageRoute = writable('main')
export const contentOpacity = writable(1)
export const authCheck = writable({
  auth: false,
  passID: 'none',
  userID: 'none',
  userMail: 'none',
  age: 'none',
  gender: 'none',
  style: [
    { rass: '' },
    { emo: '' },
    { radi: '' },
    { sder: '' }
  ]
})

export const myQuestionsData = writable([])
export const allQuestionsData = writable([])