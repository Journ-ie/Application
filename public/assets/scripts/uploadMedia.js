document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('add-media').addEventListener('click', function() {
        document.getElementById('media-upload').click();
    });
    document.getElementById('media-upload').addEventListener('change', function(event) {
        const mediaPreviewContainer = document.getElementById('media-preview');
        const files = event.target.files;

        mediaPreviewContainer.innerHTML = ''; // clear prev prebiews

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/avi'];

        Array.from(files).forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                showToast(`File type ${file.type} is not allowed.`, 'error');
                return;
            }

            const fileReader = new FileReader();

            fileReader.onload = function(e) {
                let previewElement;

                if (file.type.startsWith('image/')) {
                    previewElement = document.createElement('img');
                    previewElement.src = e.target.result;
                }

                else if (file.type.startsWith('video/')) {
                    previewElement = document.createElement('video');
                    previewElement.src = e.target.result;
                    previewElement.controls = true; 
                }

                if (previewElement) {
                    mediaPreviewContainer.appendChild(previewElement);
                }
            };

            fileReader.readAsDataURL(file); 
        });
    });
});
