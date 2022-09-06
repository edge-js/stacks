let out = "";
let $lineNumber = 1;
let $filename = "{{__dirname}}index.edge";
try {
out += state.$stacks.create(state.stackName);
} catch (error) {
template.reThrow(error, $filename, $lineNumber);
}
return out;