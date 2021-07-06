import { Plugin, PluginKey } from 'prosemirror-state'
import { confluenceJiraIssue } from '@atlaskit/adf-schema'
import { ReactNodeView } from '../../nodeviews'
import ReactJIRAIssueNode from './nodeviews/jira-issue'
export const pluginKey = new PluginKey('jiraIssuePlugin')

const createPlugin = ({ portalProviderAPI, eventDispatcher }) => {
  return new Plugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: ReactNodeView.fromComponent(
          ReactJIRAIssueNode,
          portalProviderAPI,
          eventDispatcher
        )
      }
    }
  })
}

const jiraIssuePlugin = () => ({
  name: 'confluenceJiraIssue',

  nodes() {
    return [
      {
        name: 'confluenceJiraIssue',
        node: confluenceJiraIssue
      }
    ]
  },

  pmPlugins() {
    return [
      {
        name: 'jiraIssue',
        plugin: createPlugin
      }
    ]
  }
})

export default jiraIssuePlugin
