'use babel';
import BookmarksView from './bookmarks-view'
import { CompositeDisposable, Emitter, packages } from 'atom'




const log = (...args) => {
    //let caller = log.caller ? log.caller.name : log.caller;
    let caller = ""
    let name = "" // obj.constructor.name
    return [...args].map(obj => { console.log("\n[", caller, "/", name, "]", obj); })
}


export default PinnedBookmarks = {

    bookmarksView: null,
    panel: null,
    subscriptions: null,


    activate(state) {

      log("ACTIVATING")
      this.PKG_NAME = 'pinned-bookmarks'
      this.conf = atom.packages.config.get(PKG_NAME)
      this.notify("Activating" + PKG_NAME)
      log(conf)
      let initialState = this.conf.clearOnInit !== true && state ? [...state] : [state]

      this.bookmarksView = new BookmarksView()
      this.panel = atom.workspace.addLeftPanel({
          item: this.bookmarksView.getElement(),
          visible: false
      })
      log(this.panel)

      var self = this;
      let cmds = atom.commands.add('atom.workspace', {
        'pinned-bookmarks:toggle': () => self.toggle(),
        'pinned-bookmarks:add-current': () => self.add(),
        'pinned-bookmarks:add': () => self.add(),
        'pinned-bookmarks:open': (path) => self.open(path),
        'pinned-bookmarks:remove': (query) => self.remove(query),
        'pinned-bookmarks:clear': () => self.clear(),
      })
      log(cmds)
      this.subscriptions = new CompositeDisposable()
      this.subscriptions.add(cmds)
      this.listen()

      this.setupActionButton(() => self.add(), {
          text: 'Add current', icon: 'plus' })

      this.setupActionButton(() => self.clear(), {
          text: 'Clear', icon: 'x' })
    },


    deactivate() {
        this.panel.destroy()
        this.subscriptions.dispose()
        this.bookmarksView.destroy()
    },


    notify(message="no message", details=null, icon=null) {
      log("NOTIFY")

      atom.notifications.addInfo(message, {
          detail: details || null,
          dismissable: false,
          icon: icon || 'circle-slash'
      })
      return false
    },


    setupActionButton(action=null, options={}) {
        if(!action) return false;
        let btn = this.bookmarksView.addActionButton(options);
        btn.addEventListener('click', (evt) => action());
    },


    add(path) {
        console.log(this);
        var self = this;
        console.log(self);
        if(typeof path === 'undefined') {
            var editor = atom.workspace.getActiveTextEditor();
            if(typeof editor === 'undefined')
                return self.notify("Current tab is not an editor.");
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

        let item = { name, path }

        let added_element = self.bookmarksView.addItem(item)
        if(!added_element) return false

        added_element.elements.open.addEventListener('click', function(evt) {
            var name = evt.target.textContent
            var path = evt.target.parentNode.getAttribute('data-path')
            self.open(path)
        })
        added_element.elements.close.addEventListener('click', function(evt) {
            var path = evt.target.parentNode.getAttribute('data-path')
            self.remove(path)
        })
        return added_element
    },


    open(path=null) {
        pane = atom.workspace.getActivePane()
        this.notify("Opening")
        log(pane)
        for(index in pane.items) {
          log(pane, index, pane.items, pane.items[index])
          if( pane.items && pane.items[index] )
          if( pane.items[index].getPath )
          if( pane.items[index].getPath()==path ) {
              pane.activateItemAtIndex(index)
              return index
            }
        }
        atom.workspace.open(path)
    },


    remove(item=null) {
      return item ? this.bookmarksView.removeItem(item) : this.clear()
    },


    clear() {
      this.bookmarksView.items = []
      this.bookmarksView.updateList()
    },


    listen() {
      log("STARTING LISTEN")
      this.notify("Starting listen")
      const editor = atom.workspace.getActiveTextEditor ? atom.workspace.getActiveTextEditor() : null

      log(editor)
      this.subscriptions.add(editor.onDidSave(arg => {
        log(editor)
        var name = editor && editor.getLongTitle ? editor.getLongTitle() : ''
        log(name)
        this.add({
            name: name,
            path: editor.getPath ? editor.getPath() : ''
        });
      }));
      log(this.subscriptions)
    },


    serialize() {
      log("SERIALIZING", this.bookmarksView.items)
      this.notify("Serializing")
      return this.bookmarksView.serialize()
    },


    toggle() {
      this.notify("Trying to toggle the panel")
      log(this.panel)
      let result = (this.panel.isVisible() ? this.panel.hide() : this.panel.show() )
      console.log("IS VISIBLE?!?!", result)
      return result
    }


};
