document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('gallery');
    const overlay = document.getElementById('overlay');
    const overlayImg = document.getElementById('overlay-img');
    const overlayText = document.getElementById('overlay-text');
    const closeBtn = document.getElementById('close');
    const searchInput = document.getElementById('search');

    let items = [];

    fetch('https://docs.google.com/spreadsheets/d/1bXsZMEn-B2t1P1FLIOFgUIeNW1AuEWTK4WdVuyV3fwI/pub?output=csv')
        .then(response => response.text())
        .then(csv => {
            const lines = csv.split('\n');
            lines.forEach(line => {
                const [imageUrl, name, , price, details] = line.split(',');
                if (imageUrl && name && details && price) {
                    items.push({ imageUrl, name, details, price });
                    const div = document.createElement('div');
                    div.className = 'image-item';

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = name;

                    // Create element for name and price
                    const info = document.createElement('div');
                    info.className = 'image-info';
                    info.innerHTML = `<strong>${name}</strong><br>${details}<br><span class="price">${price ? `Precio: ${price}` : ''}</span>`;

                    // Append details and image to div
                    div.appendChild(img);
                    div.appendChild(info);

                    img.addEventListener('click', () => {
                        overlay.style.display = 'flex';
                        overlayImg.src = imageUrl;
                        overlayText.innerHTML = `<p><strong>${name}</strong></p><p>${details}</p><p class="price">${price ? `Precio: ${price}` : ''}</p>`;
                    });

                    gallery.appendChild(div);
                }
            });

            searchInput.addEventListener('input', function () {
                const searchTerm = searchInput.value.toLowerCase();
                gallery.innerHTML = '';
                items.filter(item => item.name.toLowerCase().includes(searchTerm)).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'image-item';

                    const img = document.createElement('img');
                    img.src = item.imageUrl;
                    img.alt = item.name;

                    // Create element for name and price
                    const info = document.createElement('div');
                    info.className = 'image-info';
                    info.innerHTML = `<strong>${item.name}</strong><br>${item.details}<br><span class="price">${item.price ? `Precio: ${item.price}` : ''}</span>`;

                    // Append details and image to div
                    div.appendChild(img);
                    div.appendChild(info);

                    img.addEventListener('click', () => {
                        overlay.style.display = 'flex';
                        overlayImg.src = item.imageUrl;
                        overlayText.innerHTML = `<p><strong>${item.name}</strong></p><p>${item.details}</p><p class="price">${item.price ? `Precio: ${item.price}` : ''}</p>`;
                    });

                    gallery.appendChild(div);
                });
            });
        });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    // Agregar evento para el botón de compartir
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', () => {
        const userMessage = document.getElementById('user-message').value;
        const message = `${overlayText.innerHTML}\n\n${userMessage}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});
