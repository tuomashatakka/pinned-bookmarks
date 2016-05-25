'use babel';

import BookmarksView from './bookmarks-view';
import { CompositeDisposable } from 'atom';

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
    },


    deactivate() {
        this.panel.destroy();
        this.subscriptions.dispose();
        this.bookmarksView.destroy();
    },


    add(path) {
        var book = this;
        if(typeof path === 'undefined') {
            editor = atom.workspace.getActiveTextEditor();
            var name = typeof editor.getLongTitle() !== 'undefined' ? editor.getLongTitle() : '';
            path = typeof editor.getPath() !== 'undefined' ? editor.getPath() : '';
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
        added_element = this.bookmarksView.addItem(item);
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
            var name = typeof editor.getLongTitle() !== 'undefined' ? editor.getLongTitle() : '';
            self.add({
                name: name,
                path: typeof editor.getPath() !== 'undefined' ? editor.getPath() : ''
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
