'use babel';

import BookmarksView from './bookmarks-view';
import { CompositeDisposable } from 'atom';

export default {


    bookmarksView: null,
    panel: null,
    subscriptions: null,


    activate(state) {
        console.log(state);
        this.bookmarksView = new BookmarksView(state.bookmarksViewState);
        this.panel = atom.workspace.addLeftPanel({
            item: this.bookmarksView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'bookmarks:toggle': () => this.toggle(),
            'bookmarks:add': () => this.add(),
            'bookmarks:open': (file) => this.open(file),
            'bookmarks:remove': (query) => this.remove(query),
            'bookmarks:clear': () => this.clear(),
        }));
        this.listen();
    },


    deactivate() {
        this.panel.destroy();
        this.subscriptions.dispose();
        this.bookmarksView.destroy();
    },


    add(editor) {
        if( typeof editor === 'undefined' ) {
            editor = atom.workspace.getActiveTextEditor();
        }
        this.bookmarksView.addItem(editor);
    },


    open(item) {
        atom.workspace.open('envy.pub');
    },


    clear(item) {
        this.bookmarksView.items = {};
    },


    listen() {
        var self = this;
        var editor = atom.workspace.getActiveTextEditor();
        this.subscriptions.add(editor.onDidChange(function(arg) {
            console.log(arg);
            console.log(editor);
            console.log(self);


            self.add(editor);
        }));
    },


    serialize() {
        return {
            bookmarksViewState: this.bookmarksView.serialize()
        };
    },


    toggle() {
        console.log('Bookmarks was toggled!');
        return (
            this.panel.isVisible() ?
            this.panel.hide() :
            this.panel.show()
        );
    }


};
