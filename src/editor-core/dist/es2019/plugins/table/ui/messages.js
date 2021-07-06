import { defineMessages } from 'react-intl'
export default defineMessages({
  insertColumn: {
    id: 'fabric.editor.insertColumn',
    defaultMessage: 'Insert column right',
    description: 'Inserts a new column to the right of selected column.'
  },
  removeColumns: {
    id: 'fabric.editor.removeColumns',
    defaultMessage: 'Delete {0, plural, one {column} other {columns}}',
    description: 'Deletes a table column.'
  },
  insertRow: {
    id: 'fabric.editor.insertRow',
    defaultMessage: 'Insert row below',
    description: 'Inserts a new row below the selected row.'
  },
  removeRows: {
    id: 'fabric.editor.removeRows',
    defaultMessage: 'Delete {0, plural, one {row} other {rows}}',
    description: 'Deletes a table row.'
  },
  cellOptions: {
    id: 'fabric.editor.cellOptions',
    defaultMessage: 'Cell options',
    description: 'Opens a menu with options for the current table cell.'
  }
})
