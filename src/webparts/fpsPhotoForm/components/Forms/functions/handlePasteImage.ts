
// eslint-disable-next-line @rushstack/no-new-null
export function handleImagePaste (e: ClipboardEvent, setImageData: (data: string | null) => void ): void {
  // Get the clipboard items from the event
  const clipboardItems = e.clipboardData?.items;

  // Loop through each item in the clipboard
  for (let i = 0; i < clipboardItems?.length; i++) {
    // Check if the item is an image
    if (clipboardItems[i].type.indexOf('image') !== -1) {
      // Get the image file from the clipboard item
      const file = clipboardItems[i].getAsFile();

      // Create a new FileReader instance
      const reader = new FileReader();

      // Define what to do when the file has been read
      reader.onloadend = function () {
        // Store the base64 image data
        setImageData(reader.result as string);
      };

      // Start reading the image file as a Data URL (base64 format)
      reader.readAsDataURL(file);
    }
  }
}