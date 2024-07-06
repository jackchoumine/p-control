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
  .start((res, doneSize) => {
    // current concurrent tasks is done
    // res is current concurrent tasks results
    // doneSize is tasks finished size
    // [{index:0, result: 1},{index:1, result: 2}] 2
    // [{index:2, result: 3},{index:4, result: 3}] 4
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

### `pControl(limit: number = 6): AsyncControl`

Create a async control instance with max concurrent limited number.

### `AsyncControl`

Have two methods:

#### `add(task: Function, params: any): void`

Add a task to control with params.

#### `start(concurrentDone: (res: {index:number,result:any }[], doneSize: number) => void): Promise<any[]>`

Start all tasks, `concurrentDone` will be called when current concurrent tasks is done.

`concurrentDone` will be called with two arguments:

- `res`: current concurrent tasks results, it's an array with object `{index: number, result: any}`, `index` is index of all task you added and `result` is async task result.
- `doneSize`: tasks finished size.

You can use `res` to do something when current concurrent tasks is done, and `doneSize` to know how many tasks is done. You can calculate progress bar with `res` or `doneSize`.

Start return a promise, when all tasks is done, promise will be resolved.

You can use `then` to get all tasks results.

## License

MIT
