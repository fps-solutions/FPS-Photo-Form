# File Drop Components

This project provides a set of reusable React components for drag-and-drop file uploads with validation for file types. The components are designed to be used in a variety of scenarios where users need to upload or drop files into a web page.

### Components

1. **FileDropBox**: A simple box that accepts files either via drag-and-drop or file selection.
2. **FileDropContainer**: A container that wraps around the `FileDropBox` and manages multiple files, passing the file list back to the parent component.

## Core Logic & Responsibilities

### 1. **FileDropBox Component**
- **File Drop Box**: Displays a draggable box that users can drop files into.
- **File Selection**: Provides a file input that allows users to manually select files if drag-and-drop isn't preferred.
- **File Type Validation**: Filters files to ensure they match the expected file types (if provided).
- **Drag-and-Drop Support**: The box supports drag-and-drop events, allowing users to drag files directly into the drop zone.
- **Callback for File Updates**: The component has a callback function that passes selected or dropped files back to the parent component.
- **UI Feedback**: Highlights the drop box when the mouse is over it, giving users visual feedback about where they can drop files.

### 2. **FileDropContainer Component**
- **Manages File List**: The `FileDropContainer` manages the list of uploaded files and provides an interface for adding, displaying, and handling those files.
- **Passes Files to Parent**: Once files are added, it passes the updated file list back to the parent component through the `onFileUpdate` callback.
- **Display Files**: It displays the list of uploaded files below the file drop area.
- **Handles Multiple File Uploads**: This component can manage multiple files at once.

## How It Works

### **FileDropBox**:
1. **Shows a Box**: Displays a box on the screen that can accept files via drag-and-drop or file input.
2. **User Drops a File**: When the user drops a file into the box, the component handles the event, validates the file type, and updates the parent with the dropped file.
3. **File Type Check**: Checks if the dropped file matches the expected file types (e.g., `image/png`, `image/jpeg`).
4. **File Selection**: Allows the user to select files through a file input dialog (if dragging and dropping is not preferred).
5. **Highlights the Box**: The drop box changes appearance (highlighted) when the user’s mouse is over it, indicating that it's a valid drop zone.
6. **Callback for File Updates**: After a file is dropped or selected, the `setParentFilesData` callback is called to notify the parent about the newly uploaded file.

### **FileDropContainer**:
1. **Container for File Drop**: Wraps the `FileDropBox` and handles the collection and management of multiple files.
2. **Handles File Updates**: The `onFileUpdate` callback is used to receive the updated list of files from the `FileDropBox`.
3. **Displays Uploaded Files**: Lists the names of uploaded files below the drop box.
4. **Handles Multiple Files**: Allows for multiple files to be added and managed at once.

## Human Readable Functionality Overview

- **Shows a box on the screen** to drag and drop files or select files from a file input dialog.
- **User drops a file** onto the box or selects it manually.
- **Box is highlighted** when the mouse is over the component, giving users visual feedback.
- **Checks for expected file type** (e.g., only allows PNG and JPEG files if that’s what’s specified).
- **Allows user to delete a file** by clearing the list and resetting the file selection.
- **Displays a list of uploaded files** below the drop box, showing the names of files that have been uploaded.
- **Handles multiple file uploads**: You can upload multiple files at once, and the file list will update accordingly.
- **Sends the updated file list to the parent component** via a callback to allow for further processing (e.g., sending the files to a server).

## Installation

1. **Install Dependencies**: Make sure you have React and TypeScript set up in your project.

```bash
npm install react
npm install typescript
```

2. **Install CSS**: Add the accompanying CSS file to your project:

```bash
import './fps-FileDropBox.css';
```

3. **Usage**:

```tsx
// Import components
import FileDropContainer from './fps-FileDropContainer';

// Inside your parent component:
<FileDropContainer
  fileTypes={ [ "image/png, image/jpeg" ] }  // Optional: Accept only specific file types
  onFileUpdate={handleFileUpdate}    // Callback to update parent with the file list
  style={{ padding: '20px', border: '1px solid #ccc' }}  // Optional custom styles
/>
```

4. **Handle File Updates**:
   The `onFileUpdate` callback in the parent will receive the array of files whenever a user selects or drops files.

```tsx
const handleFileUpdate = (files: File[]) => {
  console.log(files);  // Handle the updated files here
};
```

---

## Component API

### **FileDropBox Props**
- **fileTypes** (optional): An array of IMIMEType_Valid types (e.g., `"image/png, image/jpeg"`). This restricts the types of files the user can drop or select.
- **setParentFilesData**: A function that will be called with the array of selected/dropped files. This should be used to update the parent component with the selected files.
- **inputName** (optional): The name attribute for the file input element.
- **style** (optional): Custom CSS styles for the drop box container.

### **FileDropContainer Props**
- **fileTypes** (optional): An array of IMIMEType_Valid MIME types, which is passed down to `FileDropBox`.
- **onFileUpdate**: A callback function to receive the updated list of files from `FileDropBox`.
- **style** (optional): Custom CSS styles for the container.

---

## Development Notes

- **State Management**: The `FileDropBox` uses `useState` to manage the file list. The parent component receives the updated file list via the `setParentFilesData` callback.
- **File Validation**: The file type validation in `FileDropBox` is done by checking the MIME type of the file against the `fileTypes` prop. If the file type is not in the accepted list, it is ignored.
- **Drag-and-Drop**: The component uses native HTML5 drag-and-drop events (`onDrop`, `onDragOver`) to manage file drops.

---

### Future Improvements

- **File Size Validation**: Add file size validation to ensure files are not too large.
- **Error Handling**: Improve error handling when unsupported file types are dropped.
- **Styling**: Make the drop zone more visually appealing with more interactive styles for drag-and-drop events.

---
