import { CellSelection } from '@atlaskit/editor-tables/cell-selection'
import { NodeSelection, TextSelection, AllSelection } from 'prosemirror-state'
import { browser } from '@atlaskit/editor-common'
import { GapCursorSelection } from '../plugins/selection/gap-cursor/selection'
export const setNodeSelection = (view, pos) => {
  const { state, dispatch } = view

  if (!isFinite(pos)) {
    return
  }

  const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos))
  dispatch(tr)
}
export function setTextSelection(view, anchor, head) {
  const { state, dispatch } = view
  const tr = state.tr.setSelection(
    TextSelection.create(state.doc, anchor, head)
  )
  dispatch(tr)
}
export function setAllSelection(view) {
  const { state, dispatch } = view
  const tr = state.tr.setSelection(new AllSelection(view.state.doc))
  dispatch(tr)
}
export function setGapCursorSelection(view, pos, side) {
  const { state } = view
  view.dispatch(
    state.tr.setSelection(new GapCursorSelection(state.doc.resolve(pos), side))
  )
}
export function setCellSelection(view, anchor, head) {
  const { state, dispatch } = view
  dispatch(state.tr.setSelection(CellSelection.create(state.doc, anchor, head)))
}
export const normaliseNestedLayout = (state, node) => {
  if (state.selection.$from.depth > 1) {
    if (node.attrs.layout && node.attrs.layout !== 'default') {
      return node.type.createChecked(
        { ...node.attrs, layout: 'default' },
        node.content,
        node.marks
      )
    } // If its a breakout layout, we can remove the mark
    // Since default isn't a valid breakout mode.

    const breakoutMark = state.schema.marks.breakout

    if (breakoutMark && breakoutMark.isInSet(node.marks)) {
      const newMarks = breakoutMark.removeFromSet(node.marks)
      return node.type.createChecked(node.attrs, node.content, newMarks)
    }
  }

  return node
} // @see: https://github.com/ProseMirror/prosemirror/issues/710
// @see: https://bugs.chromium.org/p/chromium/issues/detail?id=740085
// Chrome >= 58 (desktop only)

export const isChromeWithSelectionBug =
  browser.chrome && !browser.android && browser.chrome_version >= 58
export const isSelectionAtStartOfNode = ($pos, parentNode) => {
  if (!parentNode) {
    return false
  }

  for (let i = $pos.depth + 1; i > 0; i--) {
    const node = $pos.node(i)

    if (node && node.eq(parentNode.node)) {
      break
    }

    if (i > 1 && $pos.before(i) !== $pos.before(i - 1) + 1) {
      return false
    }
  }

  return true
}
export const isSelectionAtEndOfNode = ($pos, parentNode) => {
  if (!parentNode) {
    return false
  }

  for (let i = $pos.depth + 1; i > 0; i--) {
    const node = $pos.node(i)

    if (node && node.eq(parentNode.node)) {
      break
    }

    if (i > 1 && $pos.after(i) !== $pos.after(i - 1) - 1) {
      return false
    }
  }

  return true
} // checks if the given position is within the ProseMirror document

export const isValidPosition = (pos, state) => {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true
  }

  return false
}
