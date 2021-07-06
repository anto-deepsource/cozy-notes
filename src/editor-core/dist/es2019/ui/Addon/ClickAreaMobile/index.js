import _defineProperty from '@babel/runtime/helpers/defineProperty'
import React from 'react'
import styled from 'styled-components'
import { clickAreaClickHandler } from '../click-area-helper'
/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */

const ClickWrapper = styled.div`
  height: 100%;
  min-height: ${props => props.minHeight}vh;
`
ClickWrapper.displayName = 'ClickWrapper'

/**
 * Click Area is responsible for improving UX by ensuring the user
 * can always tap beneath the content area, to insert more content.
 *
 * This is achieved by inserting a new empty paragraph at the end of
 * the document (if one doesn't already exist).
 *
 * This is particularly important when the content exceeds the visible
 * viewport height, and if the last content node captures text selection
 * e.g. table, layouts, codeblock, etc.
 *
 * This relies on the Scroll Gutter plugin which inserts additional
 * whitespace at the end of the document when it overflows the viewport.
 */
export default class ClickAreaMobile extends React.Component {
  constructor(...args) {
    super(...args)

    _defineProperty(this, 'clickElementRef', /*#__PURE__*/ React.createRef())

    _defineProperty(this, 'handleClick', event => {
      const { editorView: view } = this.props

      if (!view) {
        return
      }

      clickAreaClickHandler(view, event)
      const scrollGutterClicked =
        event.clientY > view.dom.getBoundingClientRect().bottom // Reset the default prosemirror scrollIntoView logic by
      // clamping the scroll position to the bottom of the viewport.

      if (scrollGutterClicked && this.clickElementRef.current) {
        this.clickElementRef.current.scrollIntoView(false)
      }
    })
  }

  render() {
    return /*#__PURE__*/ React.createElement(
      ClickWrapper,
      {
        className: 'editor-click-wrapper',
        minHeight: this.props.minHeight,
        onClick: this.handleClick,
        innerRef: this.clickElementRef
      },
      this.props.children
    )
  }
}
