import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DynamicRelationshipsPanel } from './RelationshipsPanel'
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

const projectAlpha = makeEntry({
  path: '/vault/project-alpha.md',
  filename: 'project-alpha.md',
  title: 'Project Alpha',
  isA: 'Project',
})

const projectBeta = makeEntry({
  path: '/vault/project-beta.md',
  filename: 'project-beta.md',
  title: 'Project Beta',
  isA: 'Project',
})

describe('DynamicRelationshipsPanel — neighborhood navigation', () => {
  it('Cmd-click on a relationship link calls onEnterNeighborhood with the resolved entry', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    render(
      <DynamicRelationshipsPanel
        frontmatter={{ belongs_to: '[[project-alpha]]' }}
        entries={[projectAlpha]}
        typeEntryMap={{}}
        onNavigate={onNavigate}
        onEnterNeighborhood={onEnterNeighborhood}
      />,
    )

    fireEvent.click(screen.getByText('Project Alpha'), { metaKey: true })

    expect(onEnterNeighborhood).toHaveBeenCalledWith(projectAlpha)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('Ctrl-click on a relationship link calls onEnterNeighborhood with the resolved entry', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    render(
      <DynamicRelationshipsPanel
        frontmatter={{ belongs_to: '[[project-alpha]]' }}
        entries={[projectAlpha]}
        typeEntryMap={{}}
        onNavigate={onNavigate}
        onEnterNeighborhood={onEnterNeighborhood}
      />,
    )

    fireEvent.click(screen.getByText('Project Alpha'), { ctrlKey: true })

    expect(onEnterNeighborhood).toHaveBeenCalledWith(projectAlpha)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('regular click on a relationship link navigates instead of entering neighborhood', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    render(
      <DynamicRelationshipsPanel
        frontmatter={{ belongs_to: '[[project-alpha]]' }}
        entries={[projectAlpha]}
        typeEntryMap={{}}
        onNavigate={onNavigate}
        onEnterNeighborhood={onEnterNeighborhood}
      />,
    )

    fireEvent.click(screen.getByText('Project Alpha'))

    expect(onNavigate).toHaveBeenCalledWith('project-alpha')
    expect(onEnterNeighborhood).not.toHaveBeenCalled()
  })

  it('Cmd-click resolves each link in a multi-ref group independently', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    render(
      <DynamicRelationshipsPanel
        frontmatter={{ belongs_to: ['[[project-alpha]]', '[[project-beta]]'] }}
        entries={[projectAlpha, projectBeta]}
        typeEntryMap={{}}
        onNavigate={onNavigate}
        onEnterNeighborhood={onEnterNeighborhood}
      />,
    )

    fireEvent.click(screen.getByText('Project Beta'), { metaKey: true })

    expect(onEnterNeighborhood).toHaveBeenCalledExactlyOnceWith(projectBeta)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('Cmd-click is a no-op when the wikilink target cannot be resolved', () => {
    const onNavigate = vi.fn()
    const onEnterNeighborhood = vi.fn()
    render(
      <DynamicRelationshipsPanel
        frontmatter={{ belongs_to: '[[ghost-note]]' }}
        entries={[projectAlpha]}
        typeEntryMap={{}}
        onNavigate={onNavigate}
        onEnterNeighborhood={onEnterNeighborhood}
      />,
    )

    fireEvent.click(screen.getByText('Ghost Note'), { metaKey: true })

    expect(onEnterNeighborhood).not.toHaveBeenCalled()
  })
})
