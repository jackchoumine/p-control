# p-control

Promise concurrency control.

Run multiple async tasks with limited number in a easy way.

> Why you need this?

When you have many asynchronous tasks, example for 100 http requests, you need to group them and execute them in concurrently group by group, it can help with well.

## features

- control async task by concurrent number
- api is elegant and easy to use
- promise and ts based
- support browser and nodejs
- very small size
- MIT license

## install

```bash
npm install p-control
```

## usage

### esm

```js
import pControl from 'p-control';

// control concurrent number，default is 6
// because of browser limit http request number is 6 in one domain
const asyncControl = pControl(2)

const taskParams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// async task
const task = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(params)
    }, 1000)
  })
}

// add task to control with params firstly
taskParams.forEach(params => {
  // add task params will be passed to task function
  asyncControl.add(task, params)
})
// then start all tasks
asyncControl
  .start(res => {
    // current concurrent tasks is done
    // [1,2]
    // [3,4]
    // [5,6]
    // ...
    console.log(res)
  })
  .then(allTaskResults => {
    // all tasks is done
    console.log(allTaskResults) // [1,2,3,4,5,6,7,8,9,10]
  })
```

### node commonjs

```js
const pControl = require('p-control')
// same as esm
```

### browser

```html
<!-- umd -->
<script src="https://cdn.jsdelivr.net/npm/p-control/dist/index.umd.js"></script>
<script>
  const pControl = window.PControl // or PControl
 // same as before
</script>
<!-- esm  -->
<script type="module">
  import pControl from 'https://unpkg.com/p-control/dist/index.js';
  // same as before
</script>
```

## API

### `pControl(concurrent: number = 6): AsyncControl`

Create a async control instance with concurrent number.

### `AsyncControl`

Have two methods:

#### `add(task: Function, ...params: any[]): void`

Add a task to control with params.

#### `start(callback: (res: any[]) => void): Promise<any[]>`

Start all tasks, callback will be called when current concurrent tasks is done.

Start return a promise, when all tasks is done, promise will be resolved.

You can use `then` to get all tasks results.

## License

MIT
