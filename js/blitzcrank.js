(function(mousetrap, Blitzcrank, doT){
    var debug = false;

    var comboMap = {
        combos: []
    };

    var helpOverlay = false;
    var openRegex = new RegExp('(open)');
    var adminMenu = document.querySelector('#adminmenu');
    var listItems = adminMenu.querySelectorAll('li.menu-top');
    var currentRegExp = new RegExp('(wp-has-current-submenu)');
    var theList = document.querySelector("#the-list");

    // create a bound item
    var createItem = function(item) {
        var topMenuItem = item.querySelector('.wp-menu-name');
        var name = null;

        if( topMenuItem ) {
            name = topMenuItem.innerText || topMenuItem.textContent;
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
                keys: combo.toUpperCase().split(' ')
            };

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
    +'<div id="blitzcrank-overlay">'
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
    +    '</ul>'
    +'</div>');

    // Bind help
    mousetrap.bind(['?'], function() {
        if( !helpOverlay ) {
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', helpTemplate(comboMap));
            helpOverlay = document.getElementById('blitzcrank-overlay');
        }

        if( openRegex.test(helpOverlay.getAttribute('class')) ) {
            helpOverlay.setAttribute('class', ' ');
            mousetrap.unbind('esc');
        }
        else {
            helpOverlay.setAttribute('class', 'open');
            mousetrap.bind(['esc'], function() {
                mousetrap.trigger('?');
            });
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

        var current = theList.querySelector('tr');
        current.classList.add('blitzcrank-thelist-current');

        mousetrap.bind(['up', 'down'], function(e){
            e.preventDefault();
            var next = ( e.keyIdentifier == 'Down' ) ? getNextElementSibling(current) : getPreviousElementSibling(current);

            if( next ) {
                next.classList.add('blitzcrank-thelist-current');
                current.classList.remove('blitzcrank-thelist-current');
                current = next;
            }
        });

        mousetrap.bind('x', function(){
            current.querySelector('input[type=checkbox]').click();
        });

        mousetrap.bind('enter', function(){
            current.querySelector('.row-actions').firstChild.querySelector('a').click();
        });
    }
 
})(Mousetrap, Blitzcrank, doT);