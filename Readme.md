# sanote.js

converter of sanskrit morphological notation from traditional to european and vise versa


## Installation

Deprecated:
With [component](http://github.com/component/component)


## API

````javascript
var sanote = require('./sanote');
````

three methods:

from morph object to traditional notation:

````javascript
    let mstr = sanote.tohi(object);
    ->  नपु॰, एक॰: प्र॰, द्वि॰
````

from traditional to european notation:

````javascript
    let text = 'नपु॰, एक॰: प्र॰, द्वि॰';
    let tiptext = sanote.toeu(text);
    -> neut. sg.: nom., acc
````

from european to traditional notation:

````javascript
    to be done
````



## License

  GNU GPL
