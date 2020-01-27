import React, { useEffect, useContext } from 'react'

import { withClient } from 'cozy-client'

import EditorView from 'components/notes/editor-view'
import EditorLoading from 'components/notes/editor-loading'
import EditorLoadingError from 'components/notes/editor-loading-error'
import SharingWidget from 'components/notes/sharing'
import BackFromEditing from 'components/notes/back_from_editing'
import IsPublicContext from 'components/IsPublicContext'
import useNote from 'hooks/useNote'
import useServiceClient from 'hooks/useServiceClient'
import useCollabProvider from 'hooks/useCollabProvider'
import useTitleChanges from 'hooks/useTitleChanges'
import useForceSync from 'hooks/useForceSync'
import useReturnUrl from 'hooks/useReturnUrl'
import useUser from 'hooks/useUser'
import useCollaborationState from 'hooks/useCollaborationState'
import { useDebugValue } from 'lib/debug'

import useConfirmExit from 'cozy-ui/react/hooks/useConfirmExit'
import { translate } from 'cozy-ui/react/I18n'

const Editor = translate()(
  withClient(function(props) {
    // base parameters
    const { client: cozyClient, noteId, t } = props

    // plugins and config
    const isPublic = useContext(IsPublicContext)
    const { userName, userId } = useUser({
      userName: props.userName,
      cozyClient
    })
    const serviceClient = useServiceClient({ userId, userName, cozyClient })
    const { loading, title, doc, setTitle } = useNote({ serviceClient, noteId })
    const returnUrl = useReturnUrl({
      returnUrl: props.returnUrl,
      cozyClient,
      doc
    })
    const { collabProvider, collabProviderPlugin } = useCollabProvider({
      noteId,
      serviceClient,
      docVersion: doc && doc.version
    })

    // callbacks
    const { onLocalTitleChange } = useTitleChanges({
      noteId,
      title,
      setTitle,
      serviceClient
    })
    const { forceSync, emergencySync } = useForceSync({
      doc,
      collabProvider
    })
    // when leaving the component or changing doc
    useEffect(() => forceSync, [noteId, doc, forceSync])
    // when quitting the webpage
    const { dirtyRef } = useCollaborationState(collabProvider)
    const { exitConfirmationModal, requestToLeave } = useConfirmExit({
      activate: () => dirtyRef.current,
      onLeave: emergencySync,
      title: t('Notes.Editor.exit_confirmation_title'),
      message: t('Notes.Editor.exit_confirmation_message')
    })

    useDebugValue('client', cozyClient)
    useDebugValue('notes.service', serviceClient)
    useDebugValue('notes.collabProvider', collabProvider)
    useDebugValue('notes.channel', collabProvider && collabProvider.channel)
    useDebugValue('notes.noteId', noteId)
    useDebugValue('notes.doc', doc && { ...doc.doc, version: doc.version })
    useDebugValue('notes.file', doc && doc.file)
    useDebugValue('notes.returnUrl', returnUrl)
    useDebugValue('notes.dirtyRef', dirtyRef)

    // rendering
    if (loading) {
      return <EditorLoading />
    } else if (doc) {
      return (
        <>
          <EditorView
            onTitleChange={onLocalTitleChange}
            onTitleBlur={emergencySync}
            collabProvider={collabProviderPlugin}
            defaultTitle={t('Notes.Editor.title_placeholder')}
            defaultValue={{ ...doc.doc, version: doc.version }}
            title={title && title.length > 0 ? title : undefined}
            leftComponent={
              <BackFromEditing
                returnUrl={returnUrl}
                file={doc.file}
                requestToLeave={requestToLeave}
              />
            }
            rightComponent={!isPublic && <SharingWidget file={doc.file} />}
          />
          {exitConfirmationModal}
        </>
      )
    } else {
      return <EditorLoadingError returnUrl={returnUrl} />
    }
  })
)

export default Editor
