'use babel';

export default class BookmarksView {


    items: {}


    constructor(serializedState) {
        console.log(serializedState);
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('bookmarks');

        // Create message element
        var title = document.createElement('h3');
        title.textContent = 'Bookmarks';
        title.classList.add('bookmarks-title');

        var content = document.createElement('ol');
        content.classList.add('bookmarks-list');
        content.classList.add('tree-view');

        this.elements = {
            'title': title,
            'content': content
        };
        for(key in this.elements) {
            this.element.appendChild(this.elements[key]);
        }

        window.bookmarkk = this;
        this.items =
            typeof serializedState==='undefined' ?
            {} : serializedState;
        this.updateList();
    }


    addItem(name, path) {
        this.items[name] = path;
        this.updateList();
    }


    removeItem(query) {
        if(typeof this.items[query]!=='undefined')
            this.items[query] = null;
        this.updateList();
    }


    updateList() {
        this.elements.content.innerHTML = "";
        for(key in this.items) {
            var element = document.createElement('li');
            var textElement = document.createElement('span');
            element.classList.add('entry');
            element.classList.add('list-item');
            textElement.classList.add('name');
            textElement.classList.add('icon');
            textElement.classList.add('icon-rocket');
            textElement.textContent = this.items[key];
            console.log(element);
            element.appendChild(textElement);
            this.elements.content.appendChild(element);
        }
    }


    // Returns an object that can be retrieved when package is activated
    serialize() {
        return this.items;
    }


    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }


    getElement() {
        console.log(this)
        return this.element;
    }


}
