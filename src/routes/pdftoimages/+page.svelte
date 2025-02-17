<script>
    // @ts-nocheck
    import * as pdfjsLib from 'pdfjs-dist';

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

    let images = [];
    let prompt = ""; // Define aquí el prompt que necesites
    let loading = false;
    let serverResponse = "";

    async function handleFileChange(event) {
        const files = event.target.files;
        if (!files.length) return;

        images = [];
        for (const file of files) {
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({scale: 2});
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({canvasContext: context, viewport}).promise;

                    const dataURL = canvas.toDataURL('image/png');
                    images.push({page: pageNum, dataURL});
                }
            } else if (file.type.startsWith('image/')) {
                const dataURL = await convertToBase64(file);
                images.push({page: images.length + 1, dataURL});
            }
        }
        images = [...images];
    }

    async function handleCameraCapture(event) {
        const file = event.target.files[0];
        if (!file) return;

        const dataURL = await convertToBase64(file);
        images.push({page: images.length + 1, dataURL});
        images = [...images];
    }

    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function removeImage(index) {
        images.splice(index, 1);
        images = [...images];
    }

    async function sendImagesToServer() {
        if (images.length === 0) {
            alert("No hay imágenes para enviar");
            return;
        }

        loading = true;
        serverResponse = "";

        const payload = {
            prompt,
            images: images.map(img => ({
                page: img.page,
                base64: img.dataURL.split(',')[1]
            }))
        };

        try {
            const response = await fetch('/api/process-images', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            serverResponse = data;
        } catch (error) {
            console.error("Error al enviar imágenes al servidor:", error);
            serverResponse = "Error al procesar las imágenes.";
        } finally {
            loading = false;
        }
    }
</script>


<style>
    .file-input-container {
        position: relative;
        display: inline-block;
    }

    .file-input {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .file-input-label {
        display: inline-block;
        padding: 10px 20px;
        color: white;
        cursor: pointer;
        border: none;
        font-size: 16px;
    }

    .image-container {
        display: inline-block;
        margin: 0.5rem;
        position: relative;
    }

    img {
        max-width: 400px;
        border: 1px solid #ccc;
    }

    .remove-button {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #2b2b2b;
        color: white;
        border: none;
        width: 25px;
        cursor: pointer;
        font-size: 12px;
        padding: 5px;
    }

    .send-button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }

    .send-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .loading {
        font-size: 16px;
        color: #555;
    }
</style>

<div class="file-input-container">
    <label class="file-input-label px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" for="file-input-general">🗂️ Seleccionar archivos</label>
    <input type="file" id="file-input-general" class="file-input" accept="application/pdf,image/*" multiple
           on:change={handleFileChange}/>
</div>

<div class="file-input-container">
    <label class="file-input-label px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" for="file-input-camera">📷 Capturar imagen</label>
    <input type="file" id="file-input-camera" class="file-input" accept="image/*" capture="camera"
           on:change={handleCameraCapture}/>
</div>
<div id="image-display">
    {#if images.length > 0}
        <div>
            {#each images as img, index}
                <div class="image-container">
                    <p>Página {img.page}</p>
                    <img src={img.dataURL} alt="Página del PDF"/>
                    <button class="remove-button" on:click={() => removeImage(index)}>×</button>
                </div>
            {/each}
        </div>
        <button class="send-button" on:click={sendImagesToServer} disabled={loading}>Enviar imágenes a ChatGPT</button>
    {/if}
</div>

{#if loading}
    <div class="loading">Cargando...</div>
{/if}

{#if serverResponse}
    <div class="server-response">{serverResponse}</div>
{/if}