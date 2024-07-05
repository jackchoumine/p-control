# p-control

> promise concurrency control. Async task control by concurrent number in a easy way.

## features

- control async task by concurrent number
- easy to use
- promise based
- support browser and nodejs
- very small size

## install

```bash
npm install p-control
```

## usage

### esm

```js
import pControl from 'p-control';

const control = pControl(2) // control concurrent number，default is 6 because of browser limit http request number is 6
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
  control.add(task, params) // add task params will be passed to task function
})
// then start all tasks
control
  .start(res => {
    // current concurrent tasks is done
    console.log(res) // [1,2] // [3,4] // [5,6] // [7,8] // [9,10]
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
  const control = PC.pControl(2)
 // same as before
</script>
<!-- esm  -->
<script type="module">
  import pControl from 'https://unpkg.com/p-control/dist/index.js';
  // same as before
</script>
```
