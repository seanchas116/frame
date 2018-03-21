function countNodeCharacters (node: Node): number {
  if (node instanceof Text) {
    return node.data.length
  }
  if (node instanceof HTMLBRElement) {
    return 1
  }
  return Array.from(node.childNodes).reduce((a, x) => a + countNodeCharacters(x), 0)
}

export class DOMPosition {
  constructor (public node: Node, public offset: number) {
  }

  static fromOffsetFromNode (base: Node, offset: number): DOMPosition | undefined {
    const iterator = document.createNodeIterator(base, NodeFilter.SHOW_ALL, {
      acceptNode: node => node instanceof Text || node instanceof HTMLBRElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    })
    let remainingOffset = offset
    while (true) {
      let node = iterator.nextNode()
      if (!node) {
        break
      }
      const length = node instanceof Text ? node.length : 1
      if (remainingOffset < length) {
        return new DOMPosition(node, remainingOffset)
      }
      remainingOffset -= length
    }
    return undefined
  }

  offsetFromNode (base: Node) {
    let count: number
    let child: Node | null
    let parent: Node
    if (this.node instanceof Text) {
      count = this.offset
      child = this.node.previousSibling
      parent = this.node.parentNode!
    } else {
      count = 0
      child = this.node.childNodes[this.offset - 1]
      parent = this.node
    }

    while (true) {
      while (child) {
        count += countNodeCharacters(child!)
        child = child!.previousSibling
      }
      if (parent === base) {
        break
      } else {
        child = parent.previousSibling
        parent = parent.parentNode!
      }
    }
    return count
  }
}
