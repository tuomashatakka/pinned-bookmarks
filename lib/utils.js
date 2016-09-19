'use babel';

export default {


    toggleDiff() {
        var e = document.getElementsByClassName('git-line-modified');
        var c = null;
        var editor = document.getElementsByClassName('.line');
        for(c = 0; c<e.length; c+=1) {
            var n = e[c].getAttribute('data-screen-row')
            var lines = document.querySelectorAll('.line[data-screen-row="'+n+'"]')
            lines.classList.add('git-line-modified');
        }
    }
}
