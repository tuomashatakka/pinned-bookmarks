'use babel';

import BookmarksView from './bookmarks-view';
import { CompositeDisposable, Emitter } from 'atom';

export default {


    bookmarksView: null,
    panel: null,
    subscriptions: null,


    activate(state) {
        this.bookmarksView = new BookmarksView(state.bookmarksViewState);
        this.panel = atom.workspace.addLeftPanel({
            item: this.bookmarksView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'pinned-bookmarks:toggle': () => this.toggle(),
            'pinned-bookmarks:add-current': () => this.add(),
            'pinned-bookmarks:add': () => this.add(),
            'pinned-bookmarks:open': (path) => this.open(path),
            'pinned-bookmarks:remove': (query) => this.remove(query),
            'pinned-bookmarks:clear': () => this.clear(),
        }));
        this.listen();
        var self = this;
        this.setupAction(function() { self.add(); }, {
            text: 'Add current',
            icon: 'plus',
        })
        this.setupAction(function() { self.clear(); }, {
            text: 'Clear',
            icon: 'x',
        })
    },


    deactivate() {
        this.panel.destroy();
        this.subscriptions.dispose();
        this.bookmarksView.destroy();
    },


    notify(message, details, icon) {
        atom.notifications.addInfo(message, {
            detail: typeof details === 'undefined' ? null : details,
            dismissable: false,
            icon: typeof icon === 'undefined' ? 'circle-slash' : icon
        });
        return false;
    },


    setupAction(action, options) {
        if(typeof action === 'undefined') return false;
        var btn = this.bookmarksView.addActionButton(options);
        btn.addEventListener('click', function(evt) {
            action();
        });
    },


    add(path) {
        console.log(this);
        console.log(book);
        var book = this;
        if(typeof path === 'undefined') {
            var editor = atom.workspace.getActiveTextEditor();
            if(typeof editor === 'undefined')
                return book.notify("Current tab is not an editor.");
            var name = typeof editor.getLongTitle !== 'undefined' ? editor.getLongTitle() : '';
            path = typeof editor.getPath !== 'undefined' ? editor.getPath() : '';
        }
        else if(typeof path.name !== 'undefined') {
            var name = path.name;
            path = path.path;
        }
        else {
            var name = "lörs";
        }

        var item = {
            name: name,
            path: path
        };
        added_element = book.bookmarksView.addItem(item);
        if(added_element===false) return false;

        added_element.elements.open.addEventListener('click', function(evt) {
            var name = evt.target.textContent;
            var path = evt.target.parentNode.getAttribute('data-path');
            book.open(path);
        });
        added_element.elements.close.addEventListener('click', function(evt) {
            var path = evt.target.parentNode.getAttribute('data-path');
            book.remove(path);
        });
        return added_element;
    },


    open(path) {
        pane = atom.workspace.getActivePane()
        for(index in pane.items) {
            if(typeof pane.items[index] === 'undefined' ||
               typeof pane.items[index].getPath === 'undefined') continue;
            if(pane.items[index].getPath()==path) {
                pane.activateItemAtIndex(index);
                return index;
            }
        }
        atom.workspace.open(path);
    },


    remove(item) {
        return typeof item === 'undefined' ? this.clear() :
            this.bookmarksView.removeItem(item);
    },


    clear() {
        this.bookmarksView.items = [];
        this.bookmarksView.updateList();
    },


    listen() {
        var self = this;
        var editor = atom.workspace.getActiveTextEditor();
        this.subscriptions.add(editor.onDidSave(function(arg) {
            var name = typeof editor.getLongTitle !== 'undefined' ? editor.getLongTitle() : '';
            self.add({
                name: name,
                path: typeof editor.getPath !== 'undefined' ? editor.getPath() : ''
            });
        }));
    },


    serialize() {
        return {
            bookmarksViewState: this.bookmarksView.serialize()
        };
    },


    toggle() {
        return (
            this.panel.isVisible() ?
            this.panel.hide() :
            this.panel.show()
        );
    }


};
