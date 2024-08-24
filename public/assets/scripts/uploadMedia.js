document.addEventListener('DOMContentLoaded', function() {
    
    // Trigger file input click when the camera icon is clicked
    document.getElementById('add-media').addEventListener('click', function() {
        document.getElementById('media-upload').click();
    });

    // Handle file selection and preview
    document.getElementById('media-upload').addEventListener('change', function(event) {
        const mediaPreviewContainer = document.getElementById('media-preview');

        const files = event.target.files;

        Array.from(files).forEach(file => {
            const fileReader = new FileReader();

            fileReader.onload = function(e) {
                let previewElement;

                // Check if the file is an image
                if (file.type.startsWith('image/')) {
                    previewElement = document.createElement('img');
                    previewElement.src = e.target.result;
                }

                // Check if the file is a video
                else if (file.type.startsWith('video/')) {
                    previewElement = document.createElement('video');
                    previewElement.src = e.target.result;
                    previewElement.controls = true; // Add video controls
                }

                // Append the preview element to the container
                if (previewElement) {
                    mediaPreviewContainer.appendChild(previewElement);
                }
            };

            fileReader.readAsDataURL(file); // Read the file as a data URL
        });
    });
});