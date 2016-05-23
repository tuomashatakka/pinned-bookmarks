'use babel';

import BookmarksView from './bookmarks-view';
import { CompositeDisposable } from 'atom';

export default {

  bookmarksView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.bookmarksView = new BookmarksView(state.bookmarksViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.bookmarksView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bookmarks:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.bookmarksView.destroy();
  },

  serialize() {
    return {
      bookmarksViewState: this.bookmarksView.serialize()
    };
  },

  toggle() {
    console.log('Bookmarks was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
