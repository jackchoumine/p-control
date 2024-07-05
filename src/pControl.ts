/**
 * control concurrent tasks
 * @param limit maxConcurrencyLimit default 6
 * @param finish callback function when concurrent tasks are finished
 * @returns {add, start}
 */
export default function pControl(limit: number = 6) {
  if (typeof limit !== 'number') {
    throw new Error('limit must be a number')
  }
  const maxConcurrencyLimit = limit ?? 6
  const taskQueue: Array<{ task: Function; params: any }> = []
  const allResults: any[] = []
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
    console.log('add task', taskQueue.length)
  }
  type ConcurrentDone = (res: any[]) => void
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
   * @param concurrentDone
   * @returns Promise
   */
  function runAllTasks(concurrentDone?: ConcurrentDone) {
    return new Promise((resolve, reject) => {
      runTask()
      function runTask() {
        if (taskQueue.length === 0) {
          return resolve(allResults)
        }
        const needRunTaskCount = Math.min(taskQueue.length, maxConcurrencyLimit)
        const tasks = taskQueue.splice(0, needRunTaskCount) // need run tasks
        Promise.all(tasks.map(task => task.task(task.params))).then(res => {
          concurrentDone?.(res)
          allResults.push(...res)
          runTask()
        })
      }
    })
  }
}
