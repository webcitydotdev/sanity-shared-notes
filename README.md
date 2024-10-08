# sanity-plugin-sanity-shared-notes
> This is a **Sanity Studio v3** plugin.

---

# Shared Notes Notepad Plugin for Sanity Studio
> The Shared Notes Notepad Plugin is a lightweight, non-intrusive addition to Sanity Studio that provides a convenient shared notepad functionality for team collaboration.

## Features:
Seamless Integration: Adds a collapsible notepad interface to your Sanity Studio without interfering with existing content models or the studio's structure.
Always Accessible: A small button at the bottom of the screen allows quick access to the shared notes from any part of the studio.
Expandable Interface: Click to expand into a full-sized notepad that overlays the studio interface.
Real-time Editing: Changes are immediately visible to all team members using the studio.
Persistent Storage: Notes are saved to your Sanity dataset, ensuring they persist between sessions and are available to all team members.
Simple Controls: Easy-to-use save and close buttons for managing your notes.
Non-Invasive: Doesn't add any document types or schemas to your content studio, keeping your content model clean.

## Use Cases:
Team announcements and updates
Shared to-do lists for content creators
Quick drafting area for ideas and content snippets
Temporary storage for useful links or resources
Communication hub for studio users

## Technical Details:
Utilizes Sanity's system metadata for storage, avoiding conflicts with your content types.
Built with React and Sanity UI components for a native look and feel.
Lightweight and optimized for performance.

This plugin enhances team collaboration within Sanity Studio by providing a shared space for notes and quick information exchange, all without leaving the studio environment or impacting your content structure.

---

## Installation

```sh
npm i sanity-plugin-shared-notes
```

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import { sharedNotesNotepadPlugin } from 'sanity-plugin-shared-notes'

export default defineConfig({
  //...
  plugins: [sharedNotesNotepadPlugin()],
})
```
