  const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photo = document.getElementById('photo');
        const captureButton = document.getElementById('captureButton');
        const saveButton = document.getElementById('saveButton');
        const analyzeButton = document.getElementById('analyzeButton');
        const plantNameInput = document.getElementById('plantName');
        const plantName = plantNameInput.value;
        const now = Date().toLocaleString();

        const db = indexedDB.open("PlantPhotos", 1);
        db.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("photos")) {
                db.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
            }
        };

        db.onsuccess = function (event) {
            console.log("Database opened successfully");
        };

        db.onerror = function (event) {
            console.error("Database error:", event.target.errorCode);
        };


        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment'
                    }
                });
                video.srcObject = stream;
            } catch (err) {
                console.error("Error accessing the camera", err);
            }
        }

        saveButton.addEventListener('click', () => {
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = imageDataUrl;
            console.log("Saving photo with name:", plantName + now + '.jpg');
            link.download = plantName + now + '.jpg';
            document.body.appendChild(link);
            link.click();

            const transaction = db.result.transaction("photos", "readwrite");
            const photosStore = transaction.objectStore("photos");
            const photoData = {
                plantName: plantName,
                timestamp: now,
                image: imageDataUrl
            };
            const request = photosStore.add(photoData);
            request.onsuccess = function () {
                console.log("Photo saved to IndexedDB:", photoData);
                loadPhotos();
            };
            request.onerror = function (event) {
                console.error("Error saving photo to IndexedDB:", event.target.errorCode);
            };
        });

        captureButton.addEventListener('click', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            photo.src = imageDataUrl;
        });

        function loadPhotos() {
            const transaction = db.result.transaction("photos", "readonly");
            const photosStore = transaction.objectStore("photos");
            const request = photosStore.getAll();
            request.onsuccess = function (event) {
                const photos = event.target.result;
                console.log("Loaded photos from IndexedDB:", photos);
                photosContainer.innerHTML = '';
                photos.forEach(photoData => {
                    const img = document.createElement('img');
                    img.src = photoData.image;
                    img.alt = photoData.plantName + ' - ' + photoData.timestamp;
                    img.style.width = '150px';
                    img.style.height = 'auto';
                    img.style.margin = '10px';
                    photosContainer.appendChild(img);
                });
            };
            request.onerror = function (event) {
                console.error("Error loading photos from IndexedDB:", event.target.errorCode);
            };
        }

        // Start the camera when the page loads
        window.addEventListener('load', startCamera);
