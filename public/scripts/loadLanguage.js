function loadLanguage(lang) {
    fetch(`../locales/${lang}.json`)
    .then(response => response.json())
    .then(data => {
        document.querySelectorAll("[data-key]").forEach(elem => {
            const key = elem.getAttribute('data-key');

            if (elem.tagName === 'INPUT' && elem.placeholder) {
                elem.placeholder = data[key]; 
            } else {
                elem.textContent = data[key]; 
            }
        });
    })
    .catch(error => console.error('Error loading the language file:', error));
}
