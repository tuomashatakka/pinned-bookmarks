'use babel';
import Bookmarks from './bookmarks';

export default class BookmarksView {


    items: []


    constructor(serializedState) {
        // HACK: Fixme
        // if(atom.config.get('bookmarks.clearOnInit'))
        //    serializedState = [];
        serializedState = [];

        // Create root element
        this.element = document.createElement('div');
        this.element.setAttribute('class', 'bookmarks');

        // Create message element
        var title = document.createElement('h3');
        title.textContent = 'Bookmarks';
        title.setAttribute('class', 'bookmarks-title');

        var content = document.createElement('ol');
        content.setAttribute('class', 'bookmarks-list tree-view');

        this.elements = {
            'title': title,
            'content': content
        };

        for(key in this.elements) {
            this.element.appendChild(this.elements[key]);
        }

        window.bookmarkk = this;
        this.items = typeof serializedState==='undefined'
            ? []
            : serializedState;
        this.updateList();
    }


    addItem(item) {

        var element = document.createElement('li');
        element.setAttribute('class', 'entry list-item');
        this.elements.content.appendChild(element);

        var textElement = document.createElement('span');
        textElement.setAttribute('class', 'name icon icon-rocket');
        textElement.setAttribute('data-path', item.path);
        textElement.textContent = item.name;
        element.appendChild(textElement);

        this.items.push(item);
        // this.updateList();

        return textElement;
    }


    removeItem(query) {
        if(typeof this.items[query]!=='undefined') {
            this.items[query] = null;
        }
        else {
            for(key in this.items) {
                var item = this.items[key];
                if(item.path==query) {
                    this.items[key] = null;
                    break;
                }
            }
        }
        this.updateList();
    }


    updateList() {
        this.elements.content.innerHTML = "";
        for(key in this.items) {
            var item = this.items[key];
            this.elements.content.appendChild(item.element);
        }
    }


    // Returns an object that can be retrieved when package is activated
    serialize() {
        return {};
        // this.items
    }


    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }


    getElement() {
        return this.element;
    }


}
