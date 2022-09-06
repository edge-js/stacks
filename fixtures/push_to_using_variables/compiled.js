let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += state.$stacks.create(state.stackName);
out += "\n";
out += "";
$lineNumber = 3;
let stack_9 = "";
stack_9 += "  \u003Cscript\u003E";
stack_9 += "\n";
stack_9 += "  var a = require('a')";
stack_9 += "\n";
stack_9 += "  \u003C\u002Fscript\u003E";
state.$stacks.pushTo(state.stackName, stack_9);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;