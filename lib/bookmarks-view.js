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
        var content = document.createElement('ol');
        var actions = document.createElement('ol');

        title.textContent = 'Bookmarks';
        title.setAttribute('class', 'bookmarks-title');
        content.setAttribute('class', 'bookmarks-list list-tree');
        actions.setAttribute('class', 'bookmarks-panel-actions horizontal-list');

        this.elements = {
            'title': title,
            'content': content,
            'actions': actions
        };

        for(key in this.elements) {
            this.element.appendChild(this.elements[key]);
        }

        window.bookmarkk = this;
        this.items = typeof serializedState==='undefined' ? [] : serializedState;
        this.updateList();
    }


    addActionButton(options) {

        if(typeof options === 'undefined') options = {};

        var text = typeof options['text'] !== 'undefined' ? options.text : "";
        var cls = typeof options['icon'] !== 'undefined'
            ? ("icon icon-" + options.icon) : "";
        cls += typeof options['class'] !== 'undefined'
            ? (" btn " + options.class) : " btn";
        var elem = document.createElement('li');
        elem.setAttribute('class', cls);
        elem.textContent = text;
        this.elements.actions.appendChild(elem);
        return elem;

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
