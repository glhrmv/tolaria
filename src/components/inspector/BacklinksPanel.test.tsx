import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BacklinksPanel, type BacklinkItem } from './BacklinksPanel'
import type { VaultEntry } from '../../types'

const makeEntry = (overrides: Partial<VaultEntry> = {}): VaultEntry => ({
  path: '/vault/note/test.md',
  filename: 'test.md',
  title: 'Test Note',
  isA: 'Note',
  aliases: [],
  belongsTo: [],
  relatedTo: [],
  status: null,
  archived: false,
  modifiedAt: 1700000000,
  createdAt: 1700000000,
  fileSize: 100,
  snippet: '',
  wordCount: 0,
  relationships: {},
  icon: null,
  color: null,
  order: null,
  sidebarLabel: null,
  template: null,
  sort: null,
  view: null,
  visible: null,
  properties: {},
  organized: false,
  favorite: false,
  favoriteIndex: null,
  listPropertiesDisplay: [],
  hasH1: true,
  outgoingLinks: [],
  ...overrides,
})

const sourceEntry = makeEntry({
  path: '/vault/source.md',
  filename: 'source.md',
  title: 'Source Note',
})

const renderPanel = ({ onNavigate, onEnterNeighborhood }: {
  onNavigate: ReturnType<typeof vi.fn>
  onEnterNeighborhood?: ReturnType<typeof vi.fn>
}) => {
  const backlinks: BacklinkItem[] = [{ entry: sourceEntry, context: null }]
  return render(
    <BacklinksPanel
      backlinks={backlinks}
      onNavigate={onNavigate}
      onEnterNeighborhood={onEnterNeighborhood}
    />,
  )
}

describe('BacklinksPanel — neighborhood navigation', () => {
  it('Cmd-click on a backlink calls onEnterNeighborhood with the backlink entry', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    renderPanel({ onNavigate, onEnterNeighborhood })

    fireEvent.click(screen.getByText('Source Note'), { metaKey: true })

    expect(onEnterNeighborhood).toHaveBeenCalledWith(sourceEntry)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('Ctrl-click on a backlink calls onEnterNeighborhood with the backlink entry', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    renderPanel({ onNavigate, onEnterNeighborhood })

    fireEvent.click(screen.getByText('Source Note'), { ctrlKey: true })

    expect(onEnterNeighborhood).toHaveBeenCalledWith(sourceEntry)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('regular click on a backlink navigates instead of entering neighborhood', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    renderPanel({ onNavigate, onEnterNeighborhood })

    fireEvent.click(screen.getByText('Source Note'))

    expect(onNavigate).toHaveBeenCalledWith('Source Note')
    expect(onEnterNeighborhood).not.toHaveBeenCalled()
  })

  it('Cmd-click falls back to navigation when no onEnterNeighborhood handler is provided', () => {
    const onNavigate = vi.fn()
    renderPanel({ onNavigate })

    fireEvent.click(screen.getByText('Source Note'), { metaKey: true })

    expect(onNavigate).toHaveBeenCalledWith('Source Note')
  })
})
