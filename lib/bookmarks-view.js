'use babel';
import Bookmarks from './bookmarks';
import utils from './utils';

export default class BookmarksView {


    constructor(serializedState=[]) {

        // Create root element
        this.items = []
        this.element = document.createElement('div')
        this.element.setAttribute('class', 'bookmarks')

        // Create message element
        var title = document.createElement('h3')
        var content = document.createElement('ol')
        var actions = document.createElement('ol')

        title.textContent = 'Bookmarks'
        title.setAttribute('class', 'bookmarks-title')
        content.setAttribute('class', 'bookmarks-list list-tree')
        actions.setAttribute('class', 'bookmarks-panel-actions horizontal-list')

        this.elements = {
            title: title,
            content: content,
            actions: actions
        }

        for(key in this.elements) {
            this.element.appendChild(this.elements[key]);
        }

        window.bookmarkk = this;
        this.items = typeof serializedState === 'object' ? serializedState : []
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
        if( !item || !this.items.length ) return false
        return this.items.filter(obj => obj.path && obj.path == item.path).length > 0
    }


    getItem(item) {
        if(!item) return false
        for(key in this.items) {
            if(this.items[key].path==item.path)
                return item
        }
        return false
    }


    //
    // Adds a new list item into the bookmarks panel
    // Returns false if the item is already in the list.
    // Returns the item that was provided as an argument otherwise.
    // The returned item's "elements" member contains a list of inserted elements.
    //
    addItem(item, force=false) {

        if(this.hasItem(item) && force === false) return false;

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
        }

        try {
            this.items.push(item)
        }
        catch(e) {
            console.log(e)
            this.items[item.name] = item
        }
        finally {
            this.updateList()
        }

        return item
    }


    removeItem(query) {
        if(typeof this.items[query]!=='undefined') {
            this.items[query].elements = null
            this.items.splice(key, 1)
        }
        else {
            for(key in this.items) {
                if(this.items[key].path==query) {
                    this.items[key].elements = null
                    this.items.splice(key, 1)
                    break
                }
            }
        }
        this.updateList();
    }


    updateList() {
        if(typeof this.items !== 'object') this.items = {};
        this.elements.content.innerHTML = "";
        for(key in this.items) {
            if (this.items[key] && this.items[key].elements) {
                var element = this.items[key].elements.root;
                this.elements.content.appendChild(element)
            }
        }
    }


    // Tear down any state and detach
    serialize() {
      return ([...(this.items || [])]).map(item => {
        let {path, name} = item
        return { path, name }
      })
    }


    // Tear down any state and detach
    destroy() {
        this.element.remove()
    }


    getElement() {
        return this.element
    }


}
