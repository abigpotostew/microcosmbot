import { MonitorEvent } from './monitor-events'
import { config } from '../config'
import { monitorEventToSlackFmt } from './monitor-event-to-slack'

export const trackEvent = async (event: MonitorEvent) => {
  const webhook = config.slackMonitorWebhook
  if (!webhook) {
    return
  }
  const slackMsg = monitorEventToSlackFmt(event)
  // send event to slack
  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(slackMsg),
  })
  if (!response.ok) {
    console.error('Failed to send event to slack', response.statusText)
  }
}
