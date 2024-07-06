/*
 * @Author      : ZhouQiJun
 * @Date        : 2024-07-05 13:37:15
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2024-07-06 15:41:38
 * @Description : async tasks control concurrent
 */
/**
 * control concurrent tasks
 * @example
 * const asyncControl = pControl(2)
 * @param {number} limit max concurrency limit, default 6
 * @returns {Object} asyncControl object  { add: Function, start: Function}
 * @returns {Function} asyncControl.add  add task need to run
 * @returns {Function} asyncControl.start start to run all tasks
 */
export default function pControl(limit: number = 6) {
  if (typeof limit !== 'number') {
    throw new Error('limit must be a number')
  }
  const maxConcurrencyLimit = limit ?? 6
  const taskQueue: Array<{ task: Function; params: any }> = []
  const allResults: any[] = []
  let taskSize: number = 0
  let doneSize: number = 0
  return {
    add,
    start,
  }

  /**
   * add task need to run
   * @param task a function that returns a promise
   * @param params params for task, is optional
   */
  function add(task: Function, params?: any) {
    if (typeof task !== 'function') {
      throw new Error('task must be a function')
    }
    taskQueue.push({ task, params })
    taskSize++
  }
  type ConcurrentDone = (res: any[], doneSize: number) => void
  /**
   * start to run all tasks
   * @param concurrentDone callback call when concurrent tasks are finished, params is results of current tasks
   * @returns Promise
   */
  function start(concurrentDone?: ConcurrentDone) {
    return runAllTasks(concurrentDone)
  }

  /**
   * run all tasks
   * @param concurrentDone callback call when concurrent tasks are done, params is results of current tasks.
   * @returns Promise
   */
  function runAllTasks(concurrentDone?: ConcurrentDone) {
    let statTask = 0
    return new Promise((resolve, reject) => {
      runTask()
      function runTask() {
        if (taskQueue.length === 0) {
          return resolve(allResults)
        }
        const needRunTaskCount = Math.min(taskQueue.length, maxConcurrencyLimit)
        const tasks = taskQueue.splice(0, needRunTaskCount) // need run tasks
        Promise.all(tasks.map(task => task.task(task.params))).then(res => {
          // [{index:0,result:res}]
          const resArr = res.map((item, index) => ({
            index: statTask + index,
            result: item,
          }))
          statTask += needRunTaskCount
          doneSize += needRunTaskCount
          concurrentDone?.(resArr, doneSize)
          allResults.push(...res)
          runTask()
        })
      }
    })
  }
}
