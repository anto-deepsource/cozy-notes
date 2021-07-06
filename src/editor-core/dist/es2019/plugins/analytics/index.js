import analyticsPlugin from './plugin'
import { analyticsPluginKey as pluginKey } from './plugin-key'
export {
  ACTION_SUBJECT_ID,
  ACTION_SUBJECT,
  ACTION,
  BROWSER_FREEZE_INTERACTION_TYPE,
  EVENT_TYPE,
  FULL_WIDTH_MODE,
  INDENT_DIRECTION,
  INDENT_TYPE,
  INPUT_METHOD,
  LINK_REPRESENTATION,
  LINK_RESOURCE,
  LINK_STATUS,
  MODE,
  PasteContents,
  PasteSources,
  PasteTypes,
  PLATFORMS,
  PUNC,
  SYMBOL,
  TABLE_ACTION,
  TABLE_BREAKOUT,
  TRIGGER_METHOD,
  USER_CONTEXT,
  DELETE_DIRECTION,
  LIST_TEXT_SCENARIOS
} from './types'
export {
  withAnalytics,
  addAnalytics,
  findInsertLocation,
  getAnalyticsEventsFromTransaction,
  getSelectionType,
  getStateContext,
  ruleWithAnalytics
} from './utils'
export const analyticsPluginKey = pluginKey
export default analyticsPlugin
export { fireAnalyticsEvent } from './fire-analytics-event'
