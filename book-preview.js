class BookPreview extends HTMLElement {
    constructor() {
        super();
        
        // shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // component's HTML template
        this.shadowRoot.innerHTML = `
            <style>
                .preview {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    margin: 5px;
                    width: 150px;
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }
                .preview:hover {
                    transform: scale(1.05);
                }
                .preview__image {
                    width: 100%;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                .preview__title {
                    font-size: 1em;
                    margin: 5px 0;
                }
                .preview__author {
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
            <button class="preview">
                <img class="preview__image" id="cover" src="" alt="Book cover">
                <h3 class="preview__title" id="title"></h3>
                <div class="preview__author" id="author"></div>
            </button>
        `;
    }

    // Attributes to observe for changes
    static get observedAttributes() {
        return ['cover', 'title', 'author'];
    }

    // Callback for attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.shadowRoot.getElementById(name).textContent = newValue;
        }
    }

    // ConnectedCallback is called when the component is added to the DOM
    connectedCallback() {
        this.shadowRoot.getElementById('cover').src = this.getAttribute('cover');
        this.shadowRoot.getElementById('title').textContent = this.getAttribute('title');
        this.shadowRoot.getElementById('author').textContent = this.getAttribute('author');
    }
}

// custom element
customElements.define('book-preview', BookPreview);
