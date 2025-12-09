import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { getAIReview } from "../services/gemini";

function MainPage() {
  const navigate = useNavigate();

  // TEMP: hard-coded sample folder/note tree; replace with data fetched from the backend
  // (e.g., useEffect + GET /api/tree for this user/course).
  // Folder/note tree structure: { id, name, type: 'folder' | 'note', children? }
  const [treeData, setTreeData] = useState([
    {
      id: "folder-daily",
      name: "Daily",
      type: "folder",
      children: [
        { id: "note-2025-12-01", name: "2025-12-01", type: "note" },
        { id: "note-2025-12-02", name: "2025-12-02", type: "note" },
      ],
    },
    {
      id: "folder-ideas",
      name: "Ideas",
      type: "folder",
      children: [
        { id: "note-writing-telepathy", name: "Writing is telepathy", type: "note" },
        { id: "note-calmness", name: "Calmness is a superpower", type: "note" },
        { id: "note-evergreen", name: "Evergreen notes", type: "note" },
      ],
    },
    {
      id: "folder-projects",
      name: "Projects",
      type: "folder",
      children: [
        { id: "note-jotdown", name: "JotDown App", type: "note" },
        { id: "note-cs409", name: "CS 409 Final", type: "note" },
      ],
    },
  ]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ID of the selected folder (null = root)
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Currently selected note (used to show preview + edit)
  const [selectedNote, setSelectedNote] = useState(null);

  // Inline "new item" row: { type, parentId, name }
  const [newItem, setNewItem] = useState(null);

  // Node with an open context menu (three dots)
  const [menuNodeId, setMenuNodeId] = useState(null);

  // Node being dragged
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  // Folder currently highlighted as a drop target
  const [dragOverFolderId, setDragOverFolderId] = useState(null);

  // Rename state
  const [renamingNodeId, setRenamingNodeId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // --- NEW STATE FOR EDITOR AND AI ---
  const [noteContent, setNoteContent] = useState("");
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Update editor content when a new note is selected
  useEffect(() => {
    if (selectedNote) {
      // In a real app, you would fetch the content from the backend here
      setNoteContent(`This is the content for ${selectedNote.title}. You can edit this text now!`);
      setAiFeedback(null);
    } else {
      setNoteContent("");
      setAiFeedback(null);
    }
  }, [selectedNote]);

  // --- AI HANDLER ---
  const handleGenerateReview = async () => {
    if (!noteContent) return;

    setIsLoadingAI(true);
    setAiFeedback(null);

    try {
      const review = await getAIReview(noteContent);
      setAiFeedback(review);
    } catch (error) {
      console.error(error);
      setAiFeedback("Error: Could not connect to Gemini. Please check your API key.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Sort so folders appear first, then notes; both alphabetically within type
  const sortNodesForDisplay = (a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  };

  // Insert a new node under parentId (or root if parentId === null)
  // NOTE: This is local tree manipulation; when wired to a backend,
  // you'll also call a "create folder/note" API and then update state from the response.
  const addNodeToTree = (nodes, parentId, newNode) => {
    if (parentId === null) {
      const updated = [...nodes, newNode].sort(sortNodesForDisplay);
      return updated;
    }

    return nodes.map((node) => {
      if (node.type !== "folder") return node;

      if (node.id === parentId) {
        const children = node.children ? [...node.children, newNode] : [newNode];
        children.sort(sortNodesForDisplay);
        return { ...node, children };
      }

      return {
        ...node,
        children: node.children
          ? addNodeToTree(node.children, parentId, newNode)
          : node.children,
      };
    });
  };

  const handleSelectFolder = (folderId, event) => {
    event.stopPropagation();
    setSelectedFolderId(folderId);
    setMenuNodeId(null);
  };

  const handleSelectNote = (folderId, folderName, note, event) => {
    event.stopPropagation();
    setSelectedFolderId(folderId);
    setSelectedNote({
      folderId,
      folderName,
      noteId: note.id,
      title: note.name,
    });
    setMenuNodeId(null);
  };

  // Click on empty sidebar background → reset to "root"
  const handleSidebarBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      setSelectedFolderId(null);
      setMenuNodeId(null);
      setDragOverFolderId(null);
    }
  };

  // Add note: use selected folder or root if none
  // TODO DB: when the user confirms the new note name (submitNewItem),
  // call "create note" endpoint and use the returned ID instead of Date.now().
  const handleAddNoteClick = () => {
    setMenuNodeId(null);
    setNewItem({
      type: "note",
      parentId: selectedFolderId, // null = root
      name: "",
    });
  };

  // Add folder: use selected folder or root if none
  // TODO DB: when the user confirms the new folder name (submitNewItem),
  // call "create folder" endpoint and use the returned ID instead of Date.now().
  const handleAddFolderClick = () => {
    setMenuNodeId(null);
    setNewItem({
      type: "folder",
      parentId: selectedFolderId, // null = root
      name: "",
    });
  };

  const handleNewItemNameChange = (e) => {
    setNewItem((prev) => (prev ? { ...prev, name: e.target.value } : prev));
  };

  const cancelNewItem = () => {
    setNewItem(null);
  };

  const submitNewItem = (e) => {
    e.preventDefault();
    if (!newItem || !newItem.name.trim()) {
      cancelNewItem();
      return;
    }

    const name = newItem.name.trim();

    // TEMP: using Date.now() for IDs; replace with real IDs from the backend response.
    // TODO DB: call POST /folders or /notes here, await response, and use response.id.
    const id = `${newItem.type}-${Date.now()}`;

    const newNode =
      newItem.type === "folder"
        ? { id, name, type: "folder", children: [] }
        : { id, name, type: "note" };

    setTreeData((prev) => addNodeToTree(prev, newItem.parentId, newNode));

    if (newItem.type === "folder") {
      setSelectedFolderId(id);
    }
    setNewItem(null);
  };

  // Remove a folder or note by id
  const handleDeleteNode = (targetId) => {
    // TODO DB: call DELETE /folders/:id or /notes/:id before or after updating local state.
    setTreeData((prev) => {
      const { nodes } = removeNodeFromTree(prev, targetId);
      return nodes;
    });

    if (selectedFolderId === targetId) setSelectedFolderId(null);
    if (selectedNote?.noteId === targetId) setSelectedNote(null);
    if (menuNodeId === targetId) setMenuNodeId(null);
    if (renamingNodeId === targetId) {
      setRenamingNodeId(null);
      setRenameValue("");
    }
  };

  // Rename helpers
  const startRenamingNode = (node) => {
    setRenamingNodeId(node.id);
    setRenameValue(node.name);
    setMenuNodeId(null);
  };

  const cancelRename = () => {
    setRenamingNodeId(null);
    setRenameValue("");
  };

  const applyRename = () => {
    if (!renamingNodeId) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      cancelRename();
      return;
    }

    // TODO DB: call PATCH /folders/:id or /notes/:id with { name: trimmed }
    // to persist this rename, then sync local state with server if needed.
    setTreeData((prev) => renameNodeInTree(prev, renamingNodeId, trimmed));

    // Keep selected note title in sync if we're renaming it
    if (selectedNote && selectedNote.noteId === renamingNodeId) {
      setSelectedNote((prev) => (prev ? { ...prev, title: trimmed } : prev));
    }

    cancelRename();
  };

  const renameNodeInTree = (nodes, targetId, newName) => {
    return nodes
      .map((node) => {
        if (node.id === targetId) {
          return { ...node, name: newName };
        }
        if (node.type === "folder" && node.children) {
          return {
            ...node,
            children: renameNodeInTree(node.children, targetId, newName),
          };
        }
        return node;
      })
      .sort(sortNodesForDisplay);
  };

  // Drag-and-drop helpers
  const handleDragStart = (nodeId, e) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    setDragOverFolderId(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedNodeId(null);
    setDragOverFolderId(null);
  };

  // Drag over root (empty area) to move item to root
  const handleDragOverRoot = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFolderId(null);
  };

  const handleDropOnRoot = (e) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    if (!draggedNodeId) return;

    // TODO DB: update the item's parent to "root" (null) on the backend.
    // e.g., PATCH /nodes/:id with { parentId: null }.
    setTreeData((prev) => moveNodeInTree(prev, draggedNodeId, null));
    setDraggedNodeId(null);
    setDragOverFolderId(null);
  };

  // Drag over a folder (label or children) to mark as drop target
  const handleDragOverFolder = (folderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeId || draggedNodeId === folderId) {
      setDragOverFolderId(null);
      return;
    }

    // Prevent dropping a folder into one of its own descendants
    if (isDescendant(treeData, draggedNodeId, folderId)) {
      setDragOverFolderId(null);
      return;
    }

    e.dataTransfer.dropEffect = "move";
    setDragOverFolderId(folderId);
  };

  const handleDropOnFolder = (folderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeId || draggedNodeId === folderId) {
      setDragOverFolderId(null);
      return;
    }

    // Same guard: don't allow ancestor → descendant
    if (isDescendant(treeData, draggedNodeId, folderId)) {
      setDragOverFolderId(null);
      return;
    }

    // TODO DB: update parentId on the backend to folderId for draggedNodeId.
    // e.g., PATCH /nodes/:id with { parentId: folderId }.
    setTreeData((prev) => moveNodeInTree(prev, draggedNodeId, folderId));
    setDraggedNodeId(null);
    setDragOverFolderId(null);
  };

  // Edit button → go to the note's edit page
  const handleEditClick = () => {
    if (!selectedNote) return;

    // NOTE: This just passes metadata via router state.
    // The EditPage should query the backend for the actual note content by noteId.
    navigate(`/edit/${selectedNote.noteId}`, {
      state: {
        noteId: selectedNote.noteId,
        title: selectedNote.title,
        folderId: selectedNote.folderId,
        folderName: selectedNote.folderName,
      },
    });
  };

  // Render a list of nodes (folders + notes) at this level
  const renderNodeList = (nodes, parentId = null) => {
    return (
      <>
        {/* Inline "new item" row for this level (TEMP: local-only until hooked to backend create APIs) */}
        {newItem && newItem.parentId === parentId && (
          <form onSubmit={submitNewItem}>
            <div className="new-item-row">
              <span className="new-item-icon">
                {newItem.type === "folder" ? (
                  <VscNewFolder className="icon-svg" />
                ) : (
                  <VscNewFile className="icon-svg" />
                )}
              </span>
              <input
                className="new-item-input"
                placeholder={
                  newItem.type === "folder" ? "New folder name" : "New note name"
                }
                autoFocus
                value={newItem.name}
                onChange={handleNewItemNameChange}
                onBlur={cancelNewItem}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelNewItem();
                }}
              />
            </div>
          </form>
        )}

        {nodes.map((node) => {
          if (node.type === "folder") {
            const isDropTarget = dragOverFolderId === node.id;
            const isRenaming = renamingNodeId === node.id;

            return (
              <details
                key={node.id}
                className="tree-group"
                open
                // Treat the folder block as a drop zone
                onDragOver={(e) => handleDragOverFolder(node.id, e)}
                onDrop={(e) => handleDropOnFolder(node.id, e)}
              >
                <summary
                  className={
                    "tree-folder" +
                    (selectedFolderId === node.id ? " tree-folder--active" : "") +
                    (isDropTarget ? " tree-folder--drop-target" : "")
                  }
                  onClick={(e) => handleSelectFolder(node.id, e)}
                  draggable={!isRenaming}
                  onDragStart={(e) => handleDragStart(node.id, e)}
                  onDragEnd={handleDragEnd}
                >
                  {isRenaming ? (
                    <input
                      className="rename-input"
                      value={renameValue}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyRename();
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          cancelRename();
                        }
                      }}
                      onBlur={applyRename}
                    />
                  ) : (
                    <span className="tree-folder-label">{node.name}</span>
                  )}

                  {!isRenaming && (
                    <button
                      className="row-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuNodeId((prev) => (prev === node.id ? null : node.id));
                      }}
                    >
                      ⋯
                    </button>
                  )}

                  {menuNodeId === node.id && (
                    <div
                      className="row-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="row-menu-item"
                        type="button"
                        onClick={() => {
                          setSelectedFolderId(node.id);
                          setMenuNodeId(null);
                        }}
                      >
                        Open
                      </button>
                      <button
                        className="row-menu-item"
                        type="button"
                        onClick={() => startRenamingNode(node)}
                      >
                        Rename
                      </button>
                      <button
                        className="row-menu-item row-menu-item--danger"
                        type="button"
                        onClick={() => handleDeleteNode(node.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </summary>

                <div
                  className={
                    "tree-children" +
                    (isDropTarget ? " tree-children--drop-target" : "")
                  }
                >
                  {renderNodeList(node.children || [], node.id)}
                </div>
              </details>
            );
          }

          // Render a single note
          const parentFolder = findParentFolder(treeData, node.id);
          const folderName = parentFolder?.name ?? "Root";
          const folderId = parentFolder?.id ?? null;
          const isRenaming = renamingNodeId === node.id;

          return (
            <div
              key={node.id}
              className={
                "tree-item" +
                (selectedNote?.noteId === node.id ? " tree-item--active" : "")
              }
              onClick={(e) => handleSelectNote(folderId, folderName, node, e)}
              draggable={!isRenaming}
              onDragStart={(e) => handleDragStart(node.id, e)}
              onDragEnd={handleDragEnd}
            >
              {isRenaming ? (
                <input
                  className="rename-input"
                  value={renameValue}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyRename();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      cancelRename();
                    }
                  }}
                  onBlur={applyRename}
                />
              ) : (
                <span className="tree-item-label">{node.name}</span>
              )}

              {!isRenaming && (
                <button
                  className="row-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuNodeId((prev) => (prev === node.id ? null : node.id));
                  }}
                >
                  ⋯
                </button>
              )}

              {menuNodeId === node.id && (
                <div
                  className="row-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="row-menu-item"
                    type="button"
                    onClick={() => {
                      setSelectedFolderId(folderId);
                      setSelectedNote({
                        folderId,
                        folderName,
                        noteId: node.id,
                        title: node.name,
                      });
                      setMenuNodeId(null);
                    }}
                  >
                    Open
                  </button>
                  <button
                    className="row-menu-item"
                    type="button"
                    onClick={() => startRenamingNode(node)}
                  >
                    Rename
                  </button>
                  <button
                    className="row-menu-item row-menu-item--danger"
                    type="button"
                    onClick={() => handleDeleteNode(node.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Find the parent folder node for a given id
  // (Only used locally to compute breadcrumbs/labels; no DB work here.)
  const findParentFolder = (nodes, targetId, parent = null) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return parent;
      }
      if (node.type === "folder" && node.children) {
        const found = findParentFolder(node.children, targetId, node);
        if (found) return found;
      }
    }
    return null;
  };

  // Remove a node and return both the new tree and the removed node
  // Used by handleDeleteNode and moveNodeInTree.
  // DB delete/move calls should be triggered in those handlers, not here.
  const removeNodeFromTree = (nodes, targetId) => {
    let extracted = null;

    const newNodes = nodes.reduce((acc, node) => {
      if (node.id === targetId) {
        extracted = node;
        return acc;
      }

      if (node.type === "folder" && node.children) {
        const { nodes: newChildren, extracted: childExtracted } =
          removeNodeFromTree(node.children, targetId);
        if (childExtracted) {
          extracted = childExtracted;
          acc.push({ ...node, children: newChildren });
          return acc;
        }
      }

      acc.push(node);
      return acc;
    }, []);

    return { nodes: newNodes, extracted };
  };

  // Find a node by id anywhere in the tree
  const findNodeById = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.type === "folder" && node.children) {
        const found = findNodeById(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Check if targetId lives inside ancestorId's subtree
  const isDescendant = (nodes, ancestorId, targetId) => {
    const ancestor = findNodeById(nodes, ancestorId);
    if (!ancestor || ancestor.type !== "folder" || !ancestor.children) return false;

    let found = false;

    const dfs = (children) => {
      for (const child of children) {
        if (child.id === targetId) {
          found = true;
          return;
        }
        if (child.type === "folder" && child.children) {
          dfs(child.children);
          if (found) return;
        }
      }
    };

    dfs(ancestor.children);
    return found;
  };

  // Move a node under a new parent (folder or root)
  // NOTE: DB parent updates are triggered where moveNodeInTree is called (drag/drop handlers).
  const moveNodeInTree = (nodes, nodeId, newParentId) => {
    const { nodes: withoutNode, extracted } = removeNodeFromTree(nodes, nodeId);
    if (!extracted) return nodes;
    return addNodeToTree(withoutNode, newParentId, extracted);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}`}>
      {/* Left sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? "›" : "‹"}
            </button>
            {!sidebarCollapsed && <span className="sidebar-title">Notes</span>}
          </div>

          {!sidebarCollapsed && (
            <div className="sidebar-header-right">
              <button
                className="icon-button"
                type="button"
                onClick={handleAddNoteClick}
                title="Add note"
              >
                <VscNewFile className="icon-svg" />
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={handleAddFolderClick}
                title="Add folder"
              >
                <VscNewFolder className="icon-svg" />
              </button>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <nav
            className={
              "sidebar-tree" +
              (dragOverFolderId === null && draggedNodeId ? " tree-root--drop-target" : "")
            }
            onClick={handleSidebarBackgroundClick}
            onDragOver={handleDragOverRoot}
            onDrop={handleDropOnRoot}
          >
            {/* Root-level list (TEMP: in-memory tree; later hydrate from backend on mount) */}
            {renderNodeList(treeData, null)}
          </nav>
        )}
      </aside>

      {/* Center editor pane */}
      <main className="editor-pane">
        {!selectedNote ? (
          <div className="editor-placeholder">
            <h2>No note selected</h2>
            <p>Select a note from the sidebar to start reading or writing.</p>
          </div>
        ) : (
          <>
            <header className="editor-header">
              <div className="editor-breadcrumbs">
                <span>{selectedNote.folderName}</span>
                <span>/</span>
                <span className="editor-breadcrumb-current">
                  {selectedNote.title}
                </span>
              </div>
            </header>

            <div className="editor-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <input
                value={selectedNote.title}
                readOnly
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f7f7ff',
                  fontSize: '2em',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#a3a6c0',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  width: '100%'
                }}
                placeholder="Start typing your note here..."
              />
            </div>
          </>
        )}
      </main>

      {/* RIGHT PANE — AI FEEDBACK */}
      <section className="right-pane">
        <header className="right-header">
          <span>AI Review</span>
        </header>

        <div className="ai-feedback">
          <div className="ai-feedback-header">
            <div className="ai-pill">
              {isLoadingAI ? "Gemini · Thinking..." : "Gemini 1.5 Flash"}
            </div>
            <button
              className="primary-button"
              onClick={handleGenerateReview}
              disabled={!selectedNote || isLoadingAI}
              style={{
                opacity: (!selectedNote || isLoadingAI) ? 0.6 : 1,
                cursor: (!selectedNote || isLoadingAI) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoadingAI ? 'Analyzing...' : 'Summarize'}
            </button>
          </div>

          <div className="ai-feedback-body" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
            {aiFeedback ? (
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {aiFeedback}
              </div>
            ) : (
              <>
                <p className="muted">
                  Click "Summarize" to generate:
                </p>
                <ul>
                  <li>Summaries of the note</li>
                  <li>Concepts you might be missing</li>
                  <li>Questions to quiz yourself</li>
                  <li>Links to related topics</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
