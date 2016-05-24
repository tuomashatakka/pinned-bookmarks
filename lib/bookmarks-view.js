'use babel';

export default class BookmarksView {


    items: []


    constructor(serializedState) {
        // HACK: Fixme
        if(atom.config.get('bookmarks.clearOnInit'))
            serializedState = [];
        serializedState = [];

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
            [] : serializedState;
        this.updateList();
    }


    addItem(item) {
        this.items.push(item);
        this.updateList();
    }



    removeItem(query) {
        if(typeof this.items[query]!=='undefined')
            this.items[query] = null;
        this.updateList();
    }


    updateList() {
        this.elements.content.innerHTML = "";
        console.log(this.items);
        for(key, item in this.items) {
            console.log(item)
            var name = typeof item.getLongTitle() !== 'undefined' ? item.getLongTitle() : '';
            var path = typeof item.getPath() !== 'undefined' ? item.getPath() : '';
            console.log(name);
            console.log(path);
            var element = document.createElement('li');
            var textElement = document.createElement('span');
            element.classList.add('entry');
            element.classList.add('list-item');
            textElement.classList.add('name');
            textElement.classList.add('icon');
            textElement.classList.add('icon-rocket');
            textElement.textContent = name;
            element.appendChild(textElement);
            element.addEventListener('click', function(evt) {
                console.log(this, evt, item);
            })
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
