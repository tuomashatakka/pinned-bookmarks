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


    hasItem(item) {

        for(key in this.items) {
            if(this.items[key].path==item.path)
                return true;
        }
        return false;

    }


    getItem(item) {

        for(key in this.items) {
            if(this.items[key].path==item.path)
                return item;
        }
        return false;

    }


    addItem(item) {

        console.log(item)
        console.log(this.items)
        console.log(this.hasItem(item))

        if(this.hasItem(item))
            return false;

        var element = document.createElement('li');
        var textElement = document.createElement('span');

        element.setAttribute('class', 'entry list-item');
        textElement.setAttribute('class', 'name icon icon-rocket');
        textElement.setAttribute('data-path', item.path);
        textElement.textContent = item.name;

        element.appendChild(textElement);
        this.elements.content.appendChild(element);
        item.element_open = textElement;
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
                if(this.items[key].path==query) {
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
            this.addItem(this.items[key]);
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
