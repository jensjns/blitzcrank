(function(mousetrap, Blitzcrank, doT){
    var debug = false;

    var comboMap = {
        combos: []
    };

    var helpOverlay = false;
    var taskSwitcherOverlay = false;
    var openRegex = new RegExp('(open)');
    var adminMenu = document.querySelector('#adminmenu');
    var listItems = adminMenu.querySelectorAll('li.menu-top');
    var currentRegExp = new RegExp('(wp-has-current-submenu)');
    var theList = document.querySelector("#the-list");

    var nodeToString = function(node) {
        var tmpNode = document.createElement( "div" );
        tmpNode.appendChild( node.cloneNode( true ) );
        var str = tmpNode.innerHTML;
        tmpNode = node = null; // prevent memory leaks in IE
        return str;
    };

    // create a bound item
    var createItem = function(item) {
        var topMenuItem = item.querySelector('.wp-menu-name');
        var name = null;
        var enableInTaskSwitcher = false;

        if( topMenuItem ) {
            name = topMenuItem.innerText || topMenuItem.textContent;
            enableInTaskSwitcher = true;
        }
        else {
            name = item.querySelector('a').innerText || item.querySelector('a').textContent;
        }

        var combo = (name.substr(0, 1) + ' ' + name.substr(1, 1)).toLowerCase();

        if( typeof comboMap[combo] == 'undefined' ) {
            comboMap[combo] = {
                listItem: item,
                name: name,
                combo: combo,
                anchor: item.querySelector('a'),
                keys: combo.toUpperCase().split(' '),
                taskSwitcher: enableInTaskSwitcher
            };

            if( comboMap[combo].taskSwitcher ) {
                comboMap[combo].menuImage = nodeToString(item.querySelector('a .wp-menu-image'));
            }

            comboMap.combos.push(comboMap[combo]);

            mousetrap.bind(combo, function(e, combo) {
                comboMap[combo].listItem.setAttribute('class', comboMap[combo].listItem.getAttribute('class') + ' current blitzcrank-clicked');
                comboMap[combo].anchor.click();
            });
        }
        else if( debug ) {
            console.log('Combo collision for', combo);
        }
    };

    for( var i = 0, ii = listItems.length; i < ii; i++ ) {
        createItem(listItems[i]);

        if( currentRegExp.test(listItems[i].getAttribute('class'))) {
            var submenuItems = listItems[i].querySelectorAll('.wp-submenu li');
            for(var j = 1, jj = submenuItems.length; j < jj; j++) {
                createItem(submenuItems[j]);
            }
        }
    }

    var helpTemplate = doT.template(''
    +'<div id="blitzcrank-help" class="blitzcrank-overlay">'
    +    '<ul>'
    +        '{{~it.combos :combo }}'
    +            '<li>'
    +                '<span class="combo">'
    +                    '{{~combo.keys :key }}'
    +                        '<a class="key" href="#"><span>{{=key}}</span></a>'
    +                    '{{~}}'
    +                '</span>'
    +                '<span class="name">{{=combo.name}}</span>'
    +            '</li>'
    +        '{{~}}'
    +        '<li>'
    +           '<span class="combo">'
    +               '<a class="key plus" href="#"><span>alt</span></a>'
    +               '<a class="key" href="#"><span>tab</span></a>'
    +           '</span>'
    +           '<span class="name">Taskswitcher next</span>'
    +       '</li>'
    +           '<span class="combo">'
    +               '<a class="key plus" href="#"><span>alt</span></a>'
    +               '<a class="key plus" href="#"><span>shift</span></a>'
    +               '<a class="key" href="#"><span>tab</span></a>'
    +           '</span>'
    +           '<span class="name">Taskswitcher previous</span>'
    +       '</li>'
    +    '</ul>'
    +'</div>');

    // Bind help
    mousetrap.bind(['?'], function() {
        if( !helpOverlay ) {
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', helpTemplate(comboMap));
            helpOverlay = document.getElementById('blitzcrank-help');
        }

        if( openRegex.test(helpOverlay.getAttribute('class')) ) {
            helpOverlay.classList.remove('open');
            mousetrap.unbind('esc');
        }
        else {
            helpOverlay.classList.add('open');
            helpOverlay.style.marginTop = -helpOverlay.offsetHeight/2 + 'px';
            mousetrap.bind(['esc'], function() {
                mousetrap.trigger('?');
            });
        }
    });

    // Task switcher

    var taskSwitcherTemplate = doT.template(''
    +'<div id="blitzcrank-task-switcher" class="blitzcrank-overlay">'
    +    '<ul>'
    +    '{{~it.combos :combo }}'
    +    '{{?combo.taskSwitcher}}'
    +        '<li data-combo-trigger="{{=combo.combo}}">'
    +            '{{=combo.menuImage}}'
    +            '<span class="name">{{=combo.name}}</span>'
    +        '</li>'
    +    '{{?}}'
    +    '{{~}}'
    +    '</ul>'
    +'</div>');

    var taskSwitcherCurrent = null;

    mousetrap.bind(['alt+tab', 'alt+shift+tab', 'alt+right', 'alt+left'], function(e, combo) {
        e.preventDefault();

        if( !taskSwitcherOverlay ) {
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', taskSwitcherTemplate(comboMap));
            taskSwitcherOverlay = document.getElementById('blitzcrank-task-switcher');
        }

        // trigger the associated combo when releasing the alt-key
        mousetrap.bind(['alt'], function(e) {
            mousetrap.trigger(taskSwitcherCurrent.getAttribute('data-combo-trigger'));
        }, 'keyup');
        
        if( openRegex.test(taskSwitcherOverlay.getAttribute('class')) ) {
            // taskswticher is open, move between the items
            var next = undefined;

            if( combo == 'alt+tab' || combo == 'alt+right' ) {
                next = getNextElementSibling(taskSwitcherCurrent);
            }
            else {
                next = getPreviousElementSibling(taskSwitcherCurrent);
            }

            if( typeof next == 'undefined' ) {
                if( combo == 'alt+tab' || combo == 'alt+right' ) {
                    next = taskSwitcherOverlay.querySelector('li');
                }
                else {
                    var all = taskSwitcherOverlay.querySelectorAll('li');
                    next = all[all.length-1];
                }
            }

            if( next ) {
                next.classList.add('blitzcrank-task-switcher-current');
                taskSwitcherCurrent.classList.remove('blitzcrank-task-switcher-current');
                taskSwitcherCurrent = next;
            }
        }
        else {
            // first trigger esc to close the help-overlay (if it's open)
            mousetrap.trigger('esc');
            taskSwitcherOverlay.classList.add('open');
            taskSwitcherOverlay.style.marginTop = -taskSwitcherOverlay.offsetHeight/2 + 'px';
            taskSwitcherCurrent = taskSwitcherOverlay.querySelector('li');
            taskSwitcherCurrent.classList.add('blitzcrank-task-switcher-current');
        }
    });

    mousetrap.bind('b l i t z c r a n k', function(){
        // TODO
    });


    var isWhitespace = function(node) {
        return node.nodeType == 3 && /^\s*$/.test(node.data);
    };

    var getNextElementSibling = function(node) {

        while (node && (node = node.nextSibling)) {
            if (node.nodeType == 1) {
                return node;
            }
        }
        // return undefined
    }

    var getPreviousElementSibling = function(node) {

        while (node && (node = node.previousSibling)) {
            if (node.nodeType == 1) {
                return node;
            }
        }
        // return undefined
    }

    if( theList ) {

        var theListCurrent = theList.querySelector('tr');
        theListCurrent.classList.add('blitzcrank-thelist-current');

        mousetrap.bind(['up', 'down'], function(e){
            e.preventDefault();
            var next = ( e.keyIdentifier == 'Down' ) ? getNextElementSibling(theListCurrent) : getPreviousElementSibling(theListCurrent);

            if( next ) {
                next.classList.add('blitzcrank-thelist-current');
                theListCurrent.classList.remove('blitzcrank-thelist-current');
                theListCurrent = next;
            }
        });

        mousetrap.bind('x', function(){
            theListCurrent.querySelector('input[type=checkbox]').click();
        });

        mousetrap.bind('enter', function(){
            theListCurrent.querySelector('.row-actions').firstChild.querySelector('a').click();
        });
    }
 
})(Mousetrap, Blitzcrank, doT);