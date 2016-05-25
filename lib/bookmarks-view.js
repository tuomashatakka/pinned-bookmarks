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
        this.items = typeof serializedState==='undefined' ? [] : serializedState;
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


    //
    // Adds a new list item into the bookmarks panel
    // Returns false if the item is already in the list.
    // Returns the item that was provided as an argument otherwise.
    // The returned item's "elements" member contains a list of inserted elements.
    //
    addItem(item, force) {

        if(this.hasItem(item)&&(typeof force==='undefined'||!force)) return false;

        var element = document.createElement('li');
        var textElement = document.createElement('span');
        var closeElement = document.createElement('span');

        element.setAttribute('class', 'entry list-item');
        closeElement.setAttribute('class', 'close icon icon-cross');
        textElement.setAttribute('class', 'name icon icon-rocket');
        textElement.textContent = item.name;
        element.setAttribute('data-path', item.path);
        element.appendChild(textElement);
        element.appendChild(closeElement);

        item.elements = {
            root: element,
            open: textElement,
            close: closeElement
        };

        this.items.push(item);
        this.updateList();

        return item;
    }


    removeItem(query) {
        if(typeof this.items[query]!=='undefined') {
            this.items[query].elements = null;
            this.items.splice(key, 1);
        }
        else {
            for(key in this.items) {
                if(this.items[key].path==query) {
                    this.items[key].elements = null;
                    this.items.splice(key, 1);
                    break;
                }
            }
        }
        this.updateList();
    }


    updateList() {
        this.elements.content.innerHTML = "";
        for(key in this.items) {
            var element = this.items[key].elements.root;
            this.elements.content.appendChild(element);
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
