let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += state.$stacks.create('js');
out += "\n";
out += "";
$lineNumber = 3;
let stack_2 = "";
stack_2 += "  \u003Cscript\u003E";
stack_2 += "\n";
stack_2 += "  var a = ";
$lineNumber = 5;
stack_2 += `${state.requireFoo}`;
stack_2 += "\n";
stack_2 += "  \u003C\u002Fscript\u003E";
state.$stacks.pushTo('js', stack_2);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;