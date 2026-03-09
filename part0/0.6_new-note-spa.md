```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note over browser: The browser creates a new note and rerenders the note list

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    note right of browser: {"content":"new note spa","date":"2026-03-09T10:40:35.303Z"}
    activate server
    server-->>browser: 201 created
    deactivate server
```