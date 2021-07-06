import _extends from '@babel/runtime/helpers/extends'
import _defineProperty from '@babel/runtime/helpers/defineProperty'
import React from 'react'
import { TableMap } from '@atlaskit/editor-tables/table-map'
import { CellSelection } from '@atlaskit/editor-tables/cell-selection'
import { findDomRefAtPos } from 'prosemirror-utils'
import { findTable } from '@atlaskit/editor-tables/utils'
import { injectIntl } from 'react-intl'
import { Popup } from '@atlaskit/editor-common'
import { closestElement } from '../../../../utils/dom'
import { INPUT_METHOD } from '../../../analytics'
import {
  insertColumnWithAnalytics,
  insertRowWithAnalytics
} from '../../commands-with-analytics'
import { TableCssClassName as ClassName } from '../../types'
import { checkIfNumberColumnEnabled } from '../../utils'
import getPopupOptions from './getPopupOptions'
import InsertButton from './InsertButton'

class FloatingInsertButton extends React.Component {
  constructor(props) {
    super(props)
    this.insertColumn = this.insertColumn.bind(this)
    this.insertRow = this.insertRow.bind(this)
  }

  render() {
    const {
      tableNode,
      editorView,
      insertColumnButtonIndex,
      insertRowButtonIndex,
      tableRef,
      mountPoint,
      boundariesElement,
      isHeaderColumnEnabled,
      isHeaderRowEnabled
    } = this.props
    const type =
      typeof insertColumnButtonIndex !== 'undefined'
        ? 'column'
        : typeof insertRowButtonIndex !== 'undefined'
        ? 'row'
        : null

    if (!tableNode || !tableRef || !type) {
      return null
    } // We can’t display the insert button for row|colum index 0
    // when the header row|colum is enabled, this feature will be change on the future

    if (
      (type === 'column' &&
        isHeaderColumnEnabled &&
        insertColumnButtonIndex === 0) ||
      (type === 'row' && isHeaderRowEnabled && insertRowButtonIndex === 0)
    ) {
      return null
    }

    const {
      state: { tr }
    } = editorView

    if (
      tr.selection instanceof CellSelection &&
      (tr.selection.isColSelection() || tr.selection.isRowSelection())
    ) {
      return null
    }

    const cellPosition = this.getCellPosition(type)

    if (!cellPosition) {
      return null
    }

    const tablePos = findTable(editorView.state.selection)

    if (!tablePos) {
      return null
    }

    const domAtPos = editorView.domAtPos.bind(editorView)
    const pos = cellPosition + tablePos.start + 1
    const target = findDomRefAtPos(pos, domAtPos)

    if (!target || !(target instanceof HTMLElement)) {
      return null
    }

    const targetCellRef =
      type === 'row'
        ? closestElement(target, 'tr')
        : closestElement(target, 'td, th')

    if (!targetCellRef) {
      return null
    }

    const tableContainerWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_CONTAINER}`
    )
    const tableWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`
    )
    const index =
      type === 'column' ? insertColumnButtonIndex : insertRowButtonIndex
    const hasNumberedColumns = checkIfNumberColumnEnabled(editorView.state)
    return /*#__PURE__*/ React.createElement(
      Popup,
      _extends(
        {
          target: targetCellRef,
          mountTo: tableContainerWrapper || mountPoint,
          boundariesElement: tableContainerWrapper || boundariesElement,
          scrollableElement: tableWrapper,
          forcePlacement: true,
          allowOutOfBounds: true
        },
        getPopupOptions(type, index, hasNumberedColumns, tableContainerWrapper)
      ),
      /*#__PURE__*/ React.createElement(InsertButton, {
        type: type,
        tableRef: tableRef,
        onMouseDown: type === 'column' ? this.insertColumn : this.insertRow,
        hasStickyHeaders: this.props.hasStickyHeaders || false
      })
    )
  }

  getCellPosition(type) {
    const {
      tableNode,
      insertColumnButtonIndex,
      insertRowButtonIndex
    } = this.props
    const tableMap = TableMap.get(tableNode)

    if (type === 'column') {
      const columnIndex =
        insertColumnButtonIndex === 0 ? 0 : insertColumnButtonIndex - 1

      if (columnIndex > tableMap.width - 1) {
        return null
      }

      return tableMap.positionAt(0, columnIndex, tableNode)
    } else {
      const rowIndex = insertRowButtonIndex === 0 ? 0 : insertRowButtonIndex - 1

      if (rowIndex > tableMap.height - 1) {
        return null
      }

      return tableMap.positionAt(rowIndex, 0, tableNode)
    }
  }

  insertRow(event) {
    const { editorView, insertRowButtonIndex } = this.props

    if (typeof insertRowButtonIndex !== 'undefined') {
      event.preventDefault()
      const { state, dispatch } = editorView
      insertRowWithAnalytics(INPUT_METHOD.BUTTON, {
        index: insertRowButtonIndex,
        moveCursorToInsertedRow: true
      })(state, dispatch)
    }
  }

  insertColumn(event) {
    const { editorView, insertColumnButtonIndex } = this.props

    if (typeof insertColumnButtonIndex !== 'undefined') {
      event.preventDefault()
      const { state, dispatch } = editorView
      insertColumnWithAnalytics(INPUT_METHOD.BUTTON, insertColumnButtonIndex)(
        state,
        dispatch
      )
    }
  }
}

_defineProperty(FloatingInsertButton, 'displayName', 'FloatingInsertButton')

export default injectIntl(FloatingInsertButton)
