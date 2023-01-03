import React, { useState, useRef } from 'react';
import { Caret } from './Caret';

type Props = {
    workbook: string[]
}

export function TextEditor(props: Props) {
    const divRef = useRef<HTMLDivElement>(null);
    const [keycode, setKeycode] = useState<string>('');
    const caret = new Caret();

    const handleInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.nativeEvent.isComposing || !divRef.current) { return; }

        caret.saveCaret(keycode, divRef.current);
        convertInnerHTML(divRef.current);
        caret.loadCaret(divRef.current);
    };

    const convertInnerHTML = (element: HTMLDivElement) => {
        const contentArray = contentSplitToEnter(element.innerText);
        const converted = contentArray.map((text, index) => {
            const result = convertText(text, keycode, props.workbook);
            if (index > 0) {
                return '<div>' + result + '</div>';
            } else {
                return result;
            }
        }).join('');

        element.innerHTML = converted;
    };

    const contentSplitToEnter = (content: string): string[] => {
        return content.replace(/\n\n/gi, '\n').split('\n');
    }

    const convertText = (text: string, key: string, wordbook: string[]): string => {
        const convertColor = convertTextColor(text, wordbook);
        const convertEmpty = convertEmptyToWhitespace(convertColor, key);

        return convertEmpty;
    }

    const convertTextColor = (text: string, wordbook: string[]): string => {
        let convertT = text;

        for (let word of wordbook) {
            const addText = '<font color="red">' + word + '</font>';
            const regex = new RegExp(word, 'gi');
            convertT = convertT.replace(regex, addText);
        }

        return convertT;
    }

    const convertEmptyToWhitespace = (text: string, key: string): string => {
        if (text === '' && key === 'Enter') {
            return '&nbsp;';
        } else {
            return text;
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        setKeycode(event.code);
    };

    return (
        <div
            className="TextEditor"
            ref={divRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            contentEditable
            suppressContentEditableWarning={true}
        >
        </div>
    );
}