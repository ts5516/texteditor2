type CaretPos = {
    start: number
    end: number
}

export class Caret {
    private caret: CaretPos;

    constructor() {
        this.caret = { start: 0, end: 0 };
    }

    private getCaret(element: HTMLDivElement, select: Selection) {
        const range = select.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(element);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);

        const start = preSelectionRange.toString().length;
        console.log(range.startContainer.textContent);
        return {
            start: start,
            end: start + range.toString().length
        }
    }

    private setCaret(caret: CaretPos) {
        this.caret = caret;
    }

    saveCaret(keycode: string, element: HTMLDivElement) {
        const select = window.getSelection();

        if (select) {
            const currentCaretPosition = this.getCaret(element, select);
            const caret = keycode === 'Enter' ? {
                start: currentCaretPosition.start + 1,
                end: currentCaretPosition.end + 1
            } : currentCaretPosition;

            console.log('save caret' + caret.start);
            this.setCaret(caret);
        }
    }

    loadCaret(element: HTMLDivElement) {
        const range = document.createRange();
        const sel = window.getSelection();
        console.log('load caret' + this.caret.start);

        let nodeStack: Node[] = [element];
        let node: Node | undefined = undefined;
        let foundStart = false, stop = false;
        let charIndex = 0;

        range.setStart(element, 0);
        range.collapse(true);

        while (!stop && nodeStack.length !== 0) {
            node = nodeStack.pop();
            if (node === undefined) {
                return;
            } else if (node.nodeType === 3 && node.nodeValue !== null) {
                const nextCharIndex = charIndex + node.nodeValue.length;
                if (!foundStart &&
                    this.caret.start >= charIndex && this.caret.start <= nextCharIndex) {
                    range.setStart(node, this.caret.start - charIndex);
                    foundStart = true;
                }
                if (foundStart &&
                    this.caret.end >= charIndex && this.caret.end <= nextCharIndex) {
                    range.setEnd(node, this.caret.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}