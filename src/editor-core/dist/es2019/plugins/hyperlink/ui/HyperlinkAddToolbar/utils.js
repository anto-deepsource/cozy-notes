import React from 'react'
import Rusha from 'rusha'
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16'
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16'
import Story16Icon from '@atlaskit/icon-object/glyph/story/16'
import Task16Icon from '@atlaskit/icon-object/glyph/task/16'
import Page16Icon from '@atlaskit/icon-object/glyph/page/16'
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16'
export const mapContentTypeToIcon = {
  'jira.issue': /*#__PURE__*/ React.createElement(Issue16Icon, {
    label: 'Issue'
  }),
  'jira.issue.bug': /*#__PURE__*/ React.createElement(Bug16Icon, {
    label: 'Bug'
  }),
  'jira.issue.story': /*#__PURE__*/ React.createElement(Story16Icon, {
    label: 'Story'
  }),
  'jira.issue.task': /*#__PURE__*/ React.createElement(Task16Icon, {
    label: 'Task'
  }),
  'confluence.page': /*#__PURE__*/ React.createElement(Page16Icon, {
    label: 'Page'
  }),
  'confluence.blogpost': /*#__PURE__*/ React.createElement(Blog16Icon, {
    label: 'Blog'
  })
}
export const sha1 = input => {
  return Rusha.createHash()
    .update(input)
    .digest('hex')
}
export const wordCount = input => {
  return input.split(' ').length
}
