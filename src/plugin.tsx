/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
// sharedNotesNotepadPlugin.tsx
import {Button, Card, Flex, Text, ToastParams, useToast} from '@sanity/ui'
import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {definePlugin, useClient} from 'sanity'

const NOTES_KEY = 'shared_notes_content'

interface ContentEditableProps {
  onChange: (html: string) => void
  html: string
}

const ContentEditable: React.FC<ContentEditableProps> = ({onChange, html}) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleInput = (e: ChangeEvent<HTMLDivElement>) => {
    const newHtml = e.target.innerHTML
    if (newHtml !== html) {
      onChange(newHtml)
    }
  }

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) {
      ref.current.innerHTML = html
    }
  }, [html])

  return (
    <div
      ref={ref}
      onInput={handleInput}
      contentEditable
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        lineHeight: 1.5,
        background: '#13141b',
        color: '#ffffff',
        minHeight: 'calc(100vh - 200px)',
        outline: 'none',
        border: 'none',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    />
  )
}

const NotesPanel: React.FC = () => {
  const [notes, setNotes] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const client = useClient()
  const toast = useToast()

  useEffect(() => {
    client.fetch<string | null>(`*[_id == "${NOTES_KEY}"][0].content`).then((fetchedNotes) => {
      setNotes(fetchedNotes || '')
    })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await client.createOrReplace({
        _type: 'system.metadata',
        _id: NOTES_KEY,
        content: notes,
      })
      toast.push({
        status: 'success',
        title: 'Notes saved successfully',
      } as ToastParams)
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.push({
        status: 'error',
        title: 'Failed to save notes',
      } as ToastParams)
    }
    setIsSaving(false)
  }

  return (
    <Card
      shadow={2}
      style={{
        position: 'fixed',
        bottom: isExpanded ? '20px' : '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isExpanded ? '90%' : '200px',
        maxWidth: '1400px',
        height: isExpanded ? 'calc(100vh - 40px)' : '40px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000,
        borderRadius: isExpanded ? '8px' : '8px 8px 0 0',
      }}
    >
      <Flex direction="column" style={{height: '100%'}}>
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: '0 5rem',
            alignItems: 'center',
            marginTop: isExpanded ? '20px' : '0',
            justifyContent: isExpanded ? 'space-between' : 'center',
          }}
        >
          <Button
            mode="bleed"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{display: 'flex', padding: '3px'}}
          >
            <Text weight="semibold"> {isExpanded ? 'Shared Notepad' : 'Open Shared Notepad'} </Text>
          </Button>
          {isExpanded && (
            <Flex>
              <Button
                mode="ghost"
                tone="primary"
                onClick={handleSave}
                disabled={isSaving}
                style={{marginRight: '10px', borderRadius: '50px', padding: '0 20px'}}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                mode="ghost"
                tone="critical"
                style={{borderRadius: '50px', padding: '0 20px'}}
                onClick={() => setIsExpanded(false)}
              >
                Close
              </Button>
            </Flex>
          )}
        </Flex>
        {isExpanded && (
          <Flex direction="column" flex={1} padding={4}>
            <ContentEditable html={notes} onChange={setNotes} />
          </Flex>
        )}
      </Flex>
    </Card>
  )
}

export const sharedNotesNotepadPlugin = definePlugin({
  name: 'shared-notes-notepad',
  studio: {
    components: {
      layout: (props: {renderDefault: (props: any) => React.ReactNode}) => {
        return (
          <React.Fragment>
            {props.renderDefault(props)}
            <NotesPanel />
          </React.Fragment>
        )
      },
    },
  },
})
