# Edge stacks

[![gh-workflow-image]][gh-workflow-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url] [![synk-image]][synk-url]

Edge stacks allow you to create content placeholders and push content inside them from other parts of your template. For example, You can create a placeholder for inline JavaScript in the `head` tag and push `script` tags inside it from components.

1. Following is the markup of a layout file.

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <!-- Creating a stack for JavaScript -->
       @stack('js')
     </head>
     <body>
       @!component('button', { message: 'Hello 👋' })
     </body>
   </html>
   ```

2. Now, let's create the button component. We will call a frontend JavaScript method `sayMessage` every time someone clicks the button.

   ```html
   <button click="sayMessage('{{ message }}')">Click me to get the message</button>
   ```

3. Finally, we must create the `sayMessage` function. With stacks, you can write JavaScript within the same component file.

   ```html
   <button onclick="sayMessage('{{ message }}')">Click me to get the message</button>

   @pushTo('js')
   <script>
     function sayMessage(message) {
       alert(message)
     }
   </script>
   @end
   ```

The `pushTo` tag accepts the stack's name in which to push the content. The above example will push the content inside the `js` stack we defined inside the layout file.

However, the `@pushTo` tag will push contents as many times as you import the component, which can be a deal breaker in this case.

Therefore, we ship with another `@pushOnceTo` tag. It pushes the content to a stack only once, regardless of how many times you import the component.

## Setup

You can install the package from the npm package registry as follows.

```sh
npm i edge-stacks
```

And use it as a plugin as follows.

```ts
import { Edge } from 'edge.js'
import { edgeStacks } from 'edge-stacks'

const edge = new Edge()
edge.use(edgeStacks)
```

AdonisJS users can register the plugin with the `View` object. Then, to write the setup code, you can create a [preload file](https://docs.adonisjs.com/guides/adonisrc-file#preloads).

```ts
import View from '@ioc:Adonis/Core/View'
import { edgeStacks } from 'edge-stacks'

View.use(edgeStacks)
```

## Tags

Following is the list of tags registered by this package.

### @stack

The `@stack` tag creates a named placeholder where other parts of your template can push content. The tag only accepts a single argument as the name of the stack.

```html
@stack('js') @stack('css')
```

Calling `@stack` multiple times with the same name will result in a runtime error.

```html
<!-- ❌ Fails -->
@stack('js') @stack('js')
```

```html
<!-- ✅ Works -->
@if(foo) @stack('js') @elseif (bar) @stack('js') @end
```

### @pushTo

The `@pushTo` tag pushes the contents inside a given named stack. The tag accepts a single argument as the stack name, followed by the content as the tag body.

```html
@pushTo('js')
<script defer></script>
@end
```

Calling `@pushTo` before registering a stack will result in an error.

```html
<!-- ❌ Fails, since the stack is created afterward -->
@pushTo('js') @end @stack('js')
```

### @pushOnceTo

The `@pushOnceTo` tag is the same as the `@pushTo` tag. However, it pushes the contents only once. The `@pushOnceTo` tag is helpful inside components and partials. So that you can import them multiple times, but the push side-effect happens only once.

```html
@pushOnceTo('js')
<script defer></script>
@end
```

![](https://cdn.jsdelivr.net/gh/thetutlage/static/sponsorkit/sponsors.png)

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/edge-js/stacks/test.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/edge-js/stacks/actions/workflows/test.yml 'Github action'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/edge-stacks?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'
[npm-image]: https://img.shields.io/npm/v/edge-stacks.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/edge-stacks 'npm'
[synk-image]: https://img.shields.io/snyk/vulnerabilities/github/edge-js/stacks?label=Synk%20Vulnerabilities&style=for-the-badge
[synk-url]: https://snyk.io/test/github/edge-js/stacks?targetFile=package.json 'synk'
