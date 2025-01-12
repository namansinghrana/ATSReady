import React, { useState } from 'react';

const UploadResume = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.status !== 200) {
        if (result.error === 'Duplicate file') {
          setMessage('The file already exists. Analyzing the existing file.');
        } else {
          setMessage(result.error || 'Failed to analyze the resume');
        }
      } else {
        setMessage('Resume analyzed successfully');
        // Handle the successful analysis result
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadResume;
