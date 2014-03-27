(function(trap, Blitzcrank){

    var debug = false;
    var targetMap = {};
    var bindings = Blitzcrank.bindings;
    var overlayTemplate = '<div id="blitzcrank-overlay"><ul>{{combos}}</ul></div>';
    var comboTemplate = '<li><span class="combo">{{combo}}</span><span class="name">{{name}}</span>';
    var combosHtml = '';

    for( var i = 0, ii = bindings.length; i < ii; i++ ) {
        var combo = bindings[i].combo.toLowerCase();

        if( typeof targetMap[combo] == 'undefined' ) {
            targetMap[combo] = {
                target: bindings[i].target,
                selector: bindings[i].selector,
                type: bindings[i].type,
                name: bindings[i].name,
                combo: combo,
                help: function(){
                    var keys = this.combo.split(' ');
                    var comboHtml = '';
                    for( var key in keys ) {
                        comboHtml += '<a class="key" href="#"><span>' + keys[key].toUpperCase() + '</span></a>';
                    }

                    return comboTemplate.replace('{{combo}}', comboHtml).replace('{{name}}', this.name);
                }
            };

            trap.bind(combo, function(e, combo){
                if( targetMap[combo].selector ) {

                    var menuItem = (targetMap[combo].type == 'menu-top' ) ? document.getElementById(targetMap[combo].selector) : '';
                    menuItem.setAttribute('class', menuItem.getAttribute('class') + ' current');
                }

                window.location.href = targetMap[combo].target;
            });
        }
        else if( debug ) {
            console.log('Shortcut collision for', combo);
        }
    }

    for(var combo in targetMap) {
        combosHtml += targetMap[combo].help();
    }

    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', overlayTemplate.replace('{{combos}}', combosHtml));
    var helpOverlay = document.getElementById('blitzcrank-overlay');
    var openRegex = new RegExp('(open)');

    trap.bind(['?'], function() {
        if( openRegex.test(helpOverlay.getAttribute('class')) ) {
            helpOverlay.setAttribute('class', 'a');
        }
        else {
            helpOverlay.setAttribute('class', 'open');
        }
    });

    trap.bind('b l i t z c r a n k', function(){
        // TODO
    });

    if( debug ) {
        console.log(Blitzcrank);
        console.log(targetMap);
    }

})(Mousetrap, Blitzcrank);