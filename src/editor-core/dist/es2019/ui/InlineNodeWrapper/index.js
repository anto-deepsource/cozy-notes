import React from 'react'
import styled from 'styled-components'
/**
 * @see ED-6102: Deleting inline nodes doesn't work properly on Android
 * @see discussion here: https://github.com/ProseMirror/prosemirror/issues/903
 *
 * Implemented a workaround, namely wrapping affected inline nodes into an inline block + block using following helpers.
 * As outcome deletion is handled properly, albeit cursor is still jumping impredictably
 * (this moderately affects the editing experience on Android)
 */

export function createMobileInlineDomRef() {
  const domRef = document.createElement('span')
  domRef.contentEditable = 'false'
  domRef.classList.add('inline-node--mobile')
  return domRef
}
export const InlineNodeInnerWrapper = styled.span`
  display: block;
`

const InlineNodeWrapper = ({ useInlineWrapper, children }) =>
  useInlineWrapper
    ? /*#__PURE__*/ React.createElement(InlineNodeInnerWrapper, null, children)
    : /*#__PURE__*/ React.createElement(React.Fragment, null, children)

InlineNodeWrapper.displayName = 'InlineNodeWrapper'
export default InlineNodeWrapper
