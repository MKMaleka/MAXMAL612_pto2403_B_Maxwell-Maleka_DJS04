// Import
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books;

// Book Connect Application: Manages book-related usage and User interface rendering
const BookConnectApp = {
    // Function to initialize the application
    init() {
        this.renderInitialBooks();
        this.populateDropdowns();
        this.applyUserPreferredTheme();
        this.setupEventListeners();
    },

    // Function to render the initial list of books
    renderInitialBooks() {
        const bookFragment = document.createDocumentFragment();
        matches.slice(0, BOOKS_PER_PAGE).forEach(book => {
            const bookPreview = this.createBookPreview(book);
            bookFragment.appendChild(bookPreview);
        });
        document.querySelector('[data-list-items]').appendChild(bookFragment);
    },

    // Function to create a book preview element
    createBookPreview({ author, id, image, title }) {
        const bookPreview = document.createElement('book-preview');
        bookPreview.setAttribute('cover', image);
        bookPreview.setAttribute('title', title);
        bookPreview.setAttribute('author', authors[author]);
        bookPreview.dataset.preview = id; // data attribute to track the book's id
        return bookPreview;
    },

    // Function to populate dropdown options for genres and authors
    populateDropdowns() {
        this.renderDropdownOptions('[data-search-genres]', genres, 'All Genres');
        this.renderDropdownOptions('[data-search-authors]', authors, 'All Authors');
    },

    // Helper function to render dropdown options
    renderDropdownOptions(containerSelector, options, defaultOption) {
        const dropdownFragment = document.createDocumentFragment();
        const defaultOptionElement = document.createElement('option');
        defaultOptionElement.value = 'any';
        defaultOptionElement.innerText = defaultOption;
        dropdownFragment.appendChild(defaultOptionElement);

        for (const [id, name] of Object.entries(options)) {
            const optionElement = document.createElement('option');
            optionElement.value = id;
            optionElement.innerText = name;
            dropdownFragment.appendChild(optionElement);
        }

        document.querySelector(containerSelector).appendChild(dropdownFragment);
    },

    // Function to apply  preferred theme
    applyUserPreferredTheme() {
        const isNightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.querySelector('[data-settings-theme]').value = isNightMode ? 'night' : 'day';
        this.applyTheme(isNightMode ? 'night' : 'day');
    },

    // Function to apply the selected theme
    applyTheme(theme) {
        const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', darkColor);
        document.documentElement.style.setProperty('--color-light', lightColor);
    },

    // Function to set up event listeners
    setupEventListeners() {
        document.querySelector('[data-search-cancel]').addEventListener('click', () => this.closeOverlay('[data-search-overlay]'));
        document.querySelector('[data-settings-cancel]').addEventListener('click', () => this.closeOverlay('[data-settings-overlay]'));
        document.querySelector('[data-header-search]').addEventListener('click', () => this.openOverlay('[data-search-overlay]', '[data-search-title]'));
        document.querySelector('[data-header-settings]').addEventListener('click', () => this.openOverlay('[data-settings-overlay]'));
        document.querySelector('[data-list-close]').addEventListener('click', () => this.closeOverlay('[data-list-active]'));
        document.querySelector('[data-settings-form]').addEventListener('submit', this.handleThemeChange.bind(this));
        document.querySelector('[data-search-form]').addEventListener('submit', this.handleSearchSubmit.bind(this));
        document.querySelector('[data-list-button]').addEventListener('click', this.handleShowMore.bind(this));
        document.querySelector('[data-list-items]').addEventListener('click', this.handleBookSelection.bind(this));
    },

    // Function to open overlay and set focus if needed
    openOverlay(selector, focusSelector = null) {
        document.querySelector(selector).open = true;
        if (focusSelector) document.querySelector(focusSelector).focus();
    },

    // Function to close overlay
    closeOverlay(selector) {
        document.querySelector(selector).open = false;
    },

    // Function to handle theme change
    handleThemeChange(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        this.applyTheme(theme);
        this.closeOverlay('[data-settings-overlay]');
    },

    // Function to handle search submission
    handleSearchSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        matches = this.filterBooks(filters);
        this.renderFilteredBooks();
        this.closeOverlay('[data-search-overlay]');
    },

    // Function to filter books based on search criteria
    filterBooks(filters) {
        return books.filter(book => {
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            const titleMatch = !filters.title.trim() || book.title.toLowerCase().includes(filters.title.toLowerCase());
            return genreMatch && authorMatch && titleMatch;
        });
    },

    // Function to render filtered books and update pagination button
    renderFilteredBooks() {
        page = 1;
        const listItems = document.querySelector('[data-list-items]');
        listItems.innerHTML = '';

        const fragment = document.createDocumentFragment();
        matches.slice(0, BOOKS_PER_PAGE).forEach(book => {
            fragment.appendChild(this.createBookPreview(book));
        });

        listItems.appendChild(fragment);
        this.updateShowMoreButton();
    },

    // Function to update the "Show More" button with remaining book count
    updateShowMoreButton() {
        const remaining = matches.length - (page * BOOKS_PER_PAGE);
        const showMoreButton = document.querySelector('[data-list-button]');
        showMoreButton.disabled = remaining < 1;
        showMoreButton.innerHTML = `<span>Show more</span><span class="list__remaining"> (${Math.max(remaining, 0)})</span>`;
    },

    // Function to handle showing more books
    handleShowMore() {
        const fragment = document.createDocumentFragment();
        matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE).forEach(book => {
            fragment.appendChild(this.createBookPreview(book));
        });
        document.querySelector('[data-list-items]').appendChild(fragment);
        page += 1;
        this.updateShowMoreButton();
    },

    // Function to handle book selection and display details
    handleBookSelection(event) {
        const pathArray = Array.from(event.composedPath());
        const previewNode = pathArray.find(node => node?.dataset?.preview);

        if (previewNode) {
            const selectedBook = books.find(book => book.id === previewNode.dataset.preview);
            this.displayBookDetails(selectedBook);
        }
    },

    // Function to display selected book details in the active preview
    displayBookDetails(book) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = book.image;
        document.querySelector('[data-list-image]').src = book.image;
        document.querySelector('[data-list-title]').innerText = book.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = book.description;
    }
};

// Initialize the application on page load
document.addEventListener('DOMContentLoaded', () => BookConnectApp.init());
