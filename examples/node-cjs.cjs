/*
 * @Author      : ZhouQiJun
 * @Date        : 2024-07-06 14:01:55
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2024-07-06 14:03:03
 * @Description : test cjs
 */
const pControl = require('../dist/index.cjs')

const control = pControl(2)

const taskParams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// async task
const task = params => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(params)
    }, 1000)
  })
}

// add task to control
taskParams.forEach(params => {
  control.add(task, params) // add task params will be passed to task function
})
// start all tasks
control
  .start(res => {
    // current concurrent tasks is done
    console.log(res) // [1,2] // [3,4] // [5,6] // [7,8] // [9,10]
  })
  .then(allTaskResults => {
    // when all tasks is done
    console.log(allTaskResults) // [1,2,3,4,5,6,7,8,9,10]
  })
