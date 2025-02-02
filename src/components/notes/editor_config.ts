import { EditorProps } from '@atlaskit/editor-core'

// if you change something here,
// you should update /lib/collab/schema.js
// otherwise the server part won't work
const editorConfig: EditorProps = {
  allowBreakout: true,
  allowTextColor: true,
  allowTextAlignment: true,
  allowIndentation: true,
  allowTables: {
    allowColumnSorting: true,
    allowColumnResizing: true,
    allowMergeCells: true,
    allowNumberColumn: true,
    allowBackgroundColor: true,
    allowHeaderRow: true,
    allowHeaderColumn: true,
    permittedLayouts: 'all',
    stickToolbarToBottom: true
  },
  allowPanel: true,
  allowStatus: true,
  allowRule: true,
  allowDate: true
}

export default editorConfig
