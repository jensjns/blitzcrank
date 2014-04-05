(function(trap, Blitzcrank){

    var debug = false;
    var comboMap = {};
    var overlayTemplate = '<div id="blitzcrank-overlay">{{combos}}</div>';
    var comboTemplate = '<li><span class="combo">{{combo}}</span><span class="name">{{name}}</span>';
    var overlayHtml = '';
    var helpOverlay = false;
    var openRegex = new RegExp('(open)');
    var adminMenu = document.querySelector('#adminmenu');
    var listItems = adminMenu.querySelectorAll('li.menu-top');
    var currentRegExp = new RegExp('(wp-has-current-submenu)');

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
                help: function(){
                    var keys = combo.split(' ');
                    var comboHtml = '';

                    for( var key in keys ) {
                        comboHtml += '<a class="key" href="#"><span>' + keys[key].toUpperCase() + '</span></a>';
                    }

                    return comboTemplate.replace('{{combo}}', comboHtml).replace('{{name}}', name);
                }
            };

            trap.bind(combo, function(e, combo) {
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

    // Bind help
    trap.bind(['?'], function() {
        if( !helpOverlay ) {
            for(var combo in comboMap) {
                overlayHtml += comboMap[combo].help();
            }
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', overlayTemplate.replace('{{combos}}', '<ul>' + overlayHtml + '</ul>'));
            helpOverlay = document.getElementById('blitzcrank-overlay');
        }

        if( openRegex.test(helpOverlay.getAttribute('class')) ) {
            helpOverlay.setAttribute('class', ' ');
            trap.unbind('esc');
        }
        else {
            helpOverlay.setAttribute('class', 'open');
            trap.bind(['esc'], function() {
                trap.trigger('?');
            });
        }
    });

    trap.bind('b l i t z c r a n k', function(){
        // TODO
    });

})(Mousetrap, Blitzcrank);