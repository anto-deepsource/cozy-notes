/* global cozy */
import React, { useState, useEffect, useMemo } from 'react'
import { Route, Switch, HashRouter, withRouter } from 'react-router-dom'
import { useClient } from 'cozy-client'
import useClientErrors from 'cozy-client/dist/hooks/useClientErrors'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { Layout, Main, Content } from 'cozy-ui/transpiled/react/Layout'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'
import useBreakpoints, {
  BreakpointsProvider
} from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const manifest = require('../../manifest.webapp')
import { List, Editor, Unshared } from 'components/notes'
import { getReturnUrl, getSharedDocument } from 'lib/utils'
import { useFlagSwitcher } from 'lib/debug'

import { getDataOrDefault } from 'lib/initFromDom'
import { fetchIfIsNoteReadOnly } from '../lib/utils'

const RoutedEditor = withRouter(props => {
  const returnUrl = getReturnUrl()

  return (
    <Editor
      noteId={props.match.params.id}
      returnUrl={returnUrl}
      readOnly={false}
    />
  )
})

const PrivateContext = () => (
  <Switch>
    <Route path="/n/:id" component={RoutedEditor} />
    <Route path="/" component={List} />
  </Switch>
)

const PublicContext = () => {
  const client = useClient()
  const [sharedDocumentId, setSharedDocumentId] = useState(null)
  const [readOnly, setReadOnly] = useState(false)
  const returnUrl = useMemo(() => getReturnUrl(), [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('id')) {
          // public route = /public/?sharecode=xxxx&id=xxxxx
          // The id of the note is necessary because the sharecode
          // may be about a folder and not a specific note.
          const id = searchParams.get('id')
          const readOnly = await fetchIfIsNoteReadOnly(client, id)
          setReadOnly(readOnly)
          setSharedDocumentId(id)
        } else {
          // public route = /public/?sharecode=xxxxx
          // There is no id. It should be a sharecode
          // dedicated to a unique note. We look into
          // permissions and try to open the first file.
          const { id, readOnly } = await getSharedDocument(client)
          setReadOnly(readOnly)
          setSharedDocumentId(id)
        }
      } catch {
        setSharedDocumentId(false)
      }
    }
    fetchData()
  }, [client])
  if (sharedDocumentId) {
    return (
      <Editor
        readOnly={readOnly}
        noteId={sharedDocumentId}
        returnUrl={returnUrl || false}
      />
    )
  } else if (sharedDocumentId !== null) {
    return <Unshared />
  } else {
    return <Spinner size="xxlarge" middle />
  }
}

const App = ({ isPublic }) => {
  const client = useClient()
  const { isMobile } = useBreakpoints
  const { ClientErrors } = useClientErrors()
  const { t } = useI18n()

  const appName = isMobile
    ? getDataOrDefault(client.getInstanceOptions().app.name, manifest.name)
    : ''

  const { BarCenter } = cozy.bar

  const FlagSwitcher = useFlagSwitcher()

  return (
    <BreakpointsProvider>
      <HashRouter>
        <Layout monoColumn={true}>
          {!isPublic && isMobile && (
            <BarCenter>
              <AppTitle>{appName}</AppTitle>
            </BarCenter>
          )}
          <Main>
            <Content>
              {isPublic ? <PublicContext /> : <PrivateContext />}
            </Content>
          </Main>
          <IconSprite />
          <Alerter t={t} />
          <FlagSwitcher />
        </Layout>
      </HashRouter>
      <ClientErrors />
    </BreakpointsProvider>
  )
}

export default App
