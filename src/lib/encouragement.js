export const greetings = [
  ['让每一件事，都有条不紊', '整理思路，专注行动。今天也向目标靠近一点。'],
  ['把小事做好，让今天发光', '不必一下走很远，先完成眼前这一件。'],
  ['慢慢来，也在向前走', '按自己的节奏，把想做的事变成做过的事。'],
  ['给想法，一个开始', '写下下一步，让行动替你找到方向。'],
  ['今天的进步，由你书写', '每一个小小的完成，都值得被看见。'],
  ['专注这一刻，收获小确幸', '留一点时间给目标，也留一点空间给自己。'],
  ['一步一步，靠近期待', '把大目标拆小，今天就从这里出发。'],
  ['让努力，留下完成的痕迹', '不用急着赶路，认真走好每一步。'],
  ['做一点，收获一点', '从一件小任务开始，积攒今天的好心情。'],
  ['理清思绪，轻装出发', '把事情安排好，把心情照顾好。'],
]
export const messages = {
  complete: ['今天的任务圆满完成，奖励自己一下吧！', '全部打勾！这一刻，值得为自己鼓掌。', '努力有了回响，去享受一点属于自己的时间吧。', '任务清单已通关，今天的你很棒！', '收获满满的一天，休息也是计划的一部分。', '每一步都没白走，你把计划变成了完成。', '给这份坚持点个赞，带着好心情继续出发。', '这一页，圆满收工。喝杯喜欢的饮料庆祝一下吧。'],
  ongoing: ['再坚持一下，下一次打勾就在前面。', '别急，一件一件来，你正在向前走。', '先挑一件小事完成，让节奏慢慢回来。', '已经走过的每一步，都算数。', '给自己一点耐心，按你的节奏继续。', '专注眼前这一件，剩下的慢慢解决。', '累了就短暂休息，回来再迈出下一步。', '不必一口气做完，今天的努力正在积累。'],
  empty: ['先写下一件想做的小事吧。', '空白也是起点，给今天安排一个小目标。', '从最容易的一件开始，慢慢找到节奏。', '不用排得太满，一件有意义的小事就很好。', '准备好了，就把第一个想法记下来。', '今天想为自己做点什么？从这里开始吧。', '先理清思绪，再轻松出发。', '清单在等你的第一个小计划。'],
}

// A shuffled deck avoids repeats until every phrase has been shown.
export function createPhrasePicker(storage, random = Math.random) {
  const memory = new Map()
  return (group, size) => {
    const key = `youxu.phrases.${group}.v1`
    let state = memory.get(key)
    if (!state) {
      try { state = JSON.parse(storage?.getItem(key) || 'null') } catch { /* Use memory if storage is unavailable. */ }
      if (!state || !Number.isInteger(state.last) || state.last < 0 || state.last >= size ||
        !Array.isArray(state.bag) || new Set(state.bag).size !== state.bag.length ||
        state.bag.some(n => !Number.isInteger(n) || n < 0 || n >= size || n === state.last)) state = { bag: [], last: -1 }
    }
    if (!state.bag.length) {
      state.bag = Array.from({ length: size }, (_, i) => i)
      for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        ;[state.bag[i], state.bag[j]] = [state.bag[j], state.bag[i]]
      }
      if (size > 1 && state.bag.at(-1) === state.last) [state.bag[0], state.bag[size - 1]] = [state.bag[size - 1], state.bag[0]]
    }
    state.last = state.bag.pop()
    memory.set(key, state)
    try { storage?.setItem(key, JSON.stringify(state)) } catch { /* Phrase rotation remains available in memory. */ }
    return state.last
  }
}

export function completionState(total, completed) {
  return total === 0 ? 'empty' : completed === total ? 'complete' : 'ongoing'
}
