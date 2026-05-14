import { Tracker } from '@gate-flow/tracker-sdk'

declare global {
  interface Window {
    __tracker?: Tracker
  }
}