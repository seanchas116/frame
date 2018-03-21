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
