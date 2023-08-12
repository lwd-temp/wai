import { Ref, onMounted, ref } from 'vue'
import _todayInHistoryData from '../data/today_in_history.json'
import { getDay, getMonth } from '../helpers/date'
import type { Day, Month, YearInHistory } from '../types'
import { measureParagraph } from '../helpers/style'
import ContentCard from '../components/ContentCard.vue'

const todayInHistoryData = _todayInHistoryData as YearInHistory

export const useGetTodayDisplayedEvents = (date: Date, cardRef: Ref<InstanceType<typeof ContentCard> | undefined>) => {
  const month = getMonth(date).toString() as Month
  const day = getDay(date).toString() as Day
  const todayHistoryEvents = todayInHistoryData[month][day] ?? []
  const events = ref<string[]>([])
  let index = Math.floor(Math.random() * todayHistoryEvents.length)

  onMounted(() => {
    const container = cardRef.value?.containerRef
    const title = cardRef.value?.titleRef
    const content = cardRef.value?.contentRef

    if (!container || !content || !title) return

    const { marginTop: titleMarginTop, marginBottom: titleMarginBottom } = window.getComputedStyle(title)
    const titleHeight = Math.round(title.offsetHeight + parseFloat(titleMarginTop) + parseFloat(titleMarginBottom))
    const maxHeight = container.offsetHeight - titleHeight
    let currentHeight = content.offsetHeight

    while (true) {
      const event = todayHistoryEvents[index]
      const { height } = measureParagraph(content, event)

      currentHeight += height
      if (currentHeight > maxHeight) break
      events.value.push(event)
      index = (index + 1) % todayHistoryEvents.length
    }
  })

  return { events }
}
