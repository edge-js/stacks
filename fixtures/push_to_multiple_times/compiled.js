let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += state.$stacks.create('js');
out += "\n";
out += "";
$lineNumber = 3;
let stack_3 = "";
stack_3 += "  \u003Cscript\u003E";
stack_3 += "\n";
stack_3 += "  var a = require('a')";
stack_3 += "\n";
stack_3 += "  \u003C\u002Fscript\u003E";
state.$stacks.pushTo('js', 'stack_3', stack_3);
out += "\n";
out += "";
$lineNumber = 9;
let stack_4 = "";
stack_4 += "  \u003Cscript\u003E";
stack_4 += "\n";
stack_4 += "  var b = require('b')";
stack_4 += "\n";
stack_4 += "  \u003C\u002Fscript\u003E";
state.$stacks.pushTo('js', 'stack_4', stack_4);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;