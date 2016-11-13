var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

var css = rework('').use(pureGrids.units({
    mediaQueries: {
        sm  : 'screen and (min-width: 30em)',
        md : 'screen and (min-width: 48em)',
        lg : 'screen and (min-width: 64em)',
        xl: 'screen and (min-width: 75em)'
    }
})).toString();

var fs = require('fs');
fs.writeFileSync('grid-sys.css', css);
