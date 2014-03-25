(function(trap, bindings){

    var debug = false;
    var targetMap = {};

    for( var i = 0, ii = bindings.length; i < ii; i++ ) {
        var combo = bindings[i].combo.toLowerCase();

        if( typeof targetMap[combo] == 'undefined' ) {
            targetMap[combo] = {
                target: bindings[i].target,
                selector: bindings[i].selector,
                type: bindings[i].type,
                name: bindings[i].name
            };

            trap.bind(combo, function(e, combo){
                if( targetMap[combo].selector ) {
                    var menuItem = document.getElementById(targetMap[combo].selector);
                    menuItem.setAttribute('class', menuItem.getAttribute('class') + ' current');
                }

                window.location.href = targetMap[combo].target;
            });
        }
        else if( debug ) {
            console.log('Shortcut collision for', combo);
        }
    }

    var showHelp = function() {
        // TODO: generate help page (?) which shows all keycombos css = http://cssdeck.com/labs/apple-keyboard-via-css3
        // Also add a shortcut to this page in the adminbar
        alert('show help');
    };

    var helpCombos = ['b ?'];
    
    // check if combo "b l" is available
    if( typeof targetMap['b l'] == 'undefined' ) {
        helpCombos.push('b l');
    }

    trap.bind(helpCombos, showHelp);

    if( debug ) {
        console.log(bindings);
        console.log(targetMap);
    }

})(Mousetrap, Blitzcrank);