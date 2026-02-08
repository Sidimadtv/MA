document.addEventListener('DOMContentLoaded', function () {
    const editorElement = document.getElementById('code-editor');
    
    // --- Language Configuration ---
    const languageKeywords = {
        'python': {
            keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally',
                'with', 'as', 'import', 'from', 'return', 'yield', 'break', 'continue', 'pass',
                'raise', 'assert', 'lambda', 'global', 'nonlocal', 'True', 'False', 'None',
                'and', 'or', 'not', 'in', 'is', 'async', 'await'],
            functions: ['print', 'input', 'len', 'range', 'str', 'int', 'float', 'list', 'dict',
                'set', 'tuple', 'open', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed',
                'abs', 'sum', 'min', 'max', 'type', 'isinstance', 'hasattr', 'getattr', 'setattr']
        },
        'c': {
            keywords: ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
                'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
                'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
                'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
                'NULL', 'main', 'include', 'define', 'ifdef', 'ifndef', 'endif'],
            functions: ['printf', 'scanf', 'malloc', 'free', 'sizeof', 'strlen', 'strcpy', 'strcmp',
                'strcat', 'memcpy', 'memset', 'fopen', 'fclose', 'fread', 'fwrite', 'fprintf', 'fscanf']
        },
        'cpp': {
            keywords: ['auto', 'break', 'case', 'catch', 'char', 'class', 'const', 'continue',
                'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'extern',
                'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long',
                'namespace', 'new', 'nullptr', 'operator', 'private', 'protected', 'public',
                'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'template',
                'this', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union',
                'unsigned', 'using', 'virtual', 'void', 'volatile', 'while', 'endl', 'string', 'vector'],
            functions: ['cout', 'cin', 'getline', 'push_back', 'pop_back', 'size', 'empty', 'begin', 'end']
        },
        'java': {
            keywords: ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
                'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
                'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
                'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null',
                'package', 'private', 'protected', 'public', 'return', 'short', 'static',
                'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
                'transient', 'true', 'false', 'try', 'void', 'volatile', 'while', 'System', 'String'],
            functions: ['println', 'print', 'nextInt', 'nextLine', 'nextDouble', 'length', 'equals',
                'toString', 'charAt', 'substring', 'indexOf', 'contains', 'split', 'trim', 'toLowerCase', 'toUpperCase']
        },
        'javascript': {
            keywords: ['async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
                'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
                'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let',
                'new', 'null', 'of', 'return', 'static', 'super', 'switch', 'this', 'throw',
                'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield'],
            functions: ['console.log', 'alert', 'prompt', 'parseInt', 'parseFloat', 'JSON.stringify',
                'JSON.parse', 'fetch', 'addEventListener', 'querySelector', 'querySelectorAll',
                'getElementById', 'getElementsByClassName', 'createElement', 'appendChild',
                'removeChild', 'setAttribute', 'getAttribute', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval']
        },
        'php': {
            keywords: ['abstract', 'and', 'array', 'as', 'break', 'case', 'catch', 'class', 'clone',
                'const', 'continue', 'declare', 'default', 'do', 'echo', 'else', 'elseif',
                'empty', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile',
                'eval', 'exit', 'extends', 'false', 'final', 'finally', 'for', 'foreach',
                'function', 'global', 'goto', 'if', 'implements', 'include', 'include_once',
                'instanceof', 'interface', 'isset', 'list', 'namespace', 'new', 'null', 'or',
                'print', 'private', 'protected', 'public', 'require', 'require_once', 'return',
                'static', 'switch', 'this', 'throw', 'trait', 'true', 'try', 'unset', 'use',
                'var', 'while', 'xor', 'yield'],
            functions: ['strlen', 'substr', 'strpos', 'array_push', 'array_pop', 'count', 'explode',
                'implode', 'json_encode', 'json_decode', 'isset', 'empty', 'var_dump', 'print_r', 'die']
        }
    };

    const codeSnippets = {
        'python': {
            'def': 'def ${1:function_name}(${2:params}):\n    ${3:pass}',
            'class': 'class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}',
            'for': 'for ${1:item} in ${2:items}:\n    ${3:pass}',
            'while': 'while ${1:condition}:\n    ${2:pass}',
            'if': 'if ${1:condition}:\n    ${2:pass}',
            'try': 'try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    ${3:print(e)}',
            'main': 'if __name__ == "__main__":\n    ${1:main()}'
        },
        'c': {
            'main': '#include <stdio.h>\n\nint main() {\n    ${1:// code}\n    return 0;\n}',
            'for': 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3:// code}\n}',
            'while': 'while (${1:condition}) {\n    ${2:// code}\n}',
            'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
            'func': '${1:void} ${2:function_name}(${3:params}) {\n    ${4:// code}\n}',
            'struct': 'struct ${1:Name} {\n    ${2:int field};\n};'
        },
        'cpp': {
            'main': '#include <iostream>\nusing namespace std;\n\nint main() {\n    ${1:// code}\n    return 0;\n}',
            'class': 'class ${1:ClassName} {\npublic:\n    ${1:ClassName}() {}\n    ~${1:ClassName}() {}\nprivate:\n    ${2:// members}\n};',
            'for': 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3:// code}\n}',
            'cout': 'cout << ${1:expression} << endl;',
            'cin': 'cin >> ${1:variable};'
        },
        'java': {
            'main': 'public class ${1:Main} {\n    public static void main(String[] args) {\n        ${2:// code}\n    }\n}',
            'class': 'public class ${1:ClassName} {\n    ${2:// fields}\n    \n    public ${1:ClassName}() {\n        ${3:// constructor}\n    }\n}',
            'for': 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3:// code}\n}',
            'foreach': 'for (${1:Type} ${2:item} : ${3:collection}) {\n    ${4:// code}\n}',
            'sout': 'System.out.println(${1:});',
            'try': 'try {\n    ${1:// code}\n} catch (${2:Exception} e) {\n    ${3:e.printStackTrace();}\n}'
        },
        'javascript': {
            'func': 'function ${1:name}(${2:params}) {\n    ${3:// code}\n}',
            'arrow': 'const ${1:name} = (${2:params}) => {\n    ${3:// code}\n};',
            'for': 'for (let ${1:i} = 0; ${1:i} < ${2:arr}.length; ${1:i}++) {\n    ${3:// code}\n}',
            'foreach': '${1:arr}.forEach((${2:item}) => {\n    ${3:// code}\n});',
            'log': 'console.log(${1:});',
            'async': 'async function ${1:name}(${2:params}) {\n    ${3:// code}\n}',
            'fetch': 'fetch(${1:url})\n    .then(res => res.json())\n    .then(data => ${2:console.log(data)})\n    .catch(err => console.error(err));'
        },
        'php': {
            'func': 'function ${1:name}(${2:params}) {\n    ${3:// code}\n}',
            'class': 'class ${1:ClassName} {\n    public function __construct() {\n        ${2:// constructor}\n    }\n}',
            'for': 'for ($${1:i} = 0; $${1:i} < ${2:n}; $${1:i}++) {\n    ${3:// code}\n}',
            'foreach': 'foreach ($${1:arr} as $${2:item}) {\n    ${3:// code}\n}',
            'echo': 'echo ${1:};',
            'if': 'if (${1:condition}) {\n    ${2:// code}\n}'
        }
    };

    // --- Helper Functions ---
    function getLanguageHints(cm, options) {
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        const mode = cm.getOption('mode') || '';
        let word = token.string || '';
        word = word.replace(/[^a-zA-Z0-9_]/g, '');
        if (word.length < 1) {
            return { list: [], from: cur, to: cur };
        }
        let lang = 'c';
        const modeStr = typeof mode === 'string' ? mode : (mode.name || '');
        const dataMode = editorElement ? (editorElement.getAttribute('data-mode') || '') : '';

        if (modeStr.includes('python') || dataMode.includes('python')) {
            lang = 'python';
        } else if (dataMode.includes('javascript') || modeStr.includes('javascript')) {
            lang = 'javascript';
        } else if (dataMode.includes('java')) {
            lang = 'java';
        } else if (dataMode.includes('c++') || dataMode.includes('cpp') || dataMode.includes('text/x-c++src')) {
            lang = 'cpp';
        } else if (modeStr.includes('php') || dataMode.includes('php')) {
            lang = 'php';
        } else if (modeStr.includes('clike') || dataMode.includes('text/x-csrc')) {
            lang = 'c';
        }

        const langData = languageKeywords[lang] || { keywords: [], functions: [] };
        const wordLower = word.toLowerCase();
        const hints = [];
        if (langData.keywords) {
            langData.keywords
                .filter(kw => kw.toLowerCase().startsWith(wordLower) && kw.toLowerCase() !== wordLower)
                .forEach(kw => hints.push({
                    text: kw,
                    displayText: kw,
                    className: 'hint-keyword'
                }));
        }
        if (langData.functions) {
            langData.functions
                .filter(fn => fn.toLowerCase().startsWith(wordLower) && fn.toLowerCase() !== wordLower)
                .forEach(fn => {
                    const fnName = fn.includes('.') ? fn : fn;
                    hints.push({
                        text: fnName + '()',
                        displayText: fnName + '()',
                        className: 'hint-function',
                        hint: function (cm, data, completion) {
                            cm.replaceRange(completion.text, data.from, data.to);
                            const insertedLen = fnName.length + 1;
                            const newPos = { line: data.from.line, ch: data.from.ch + insertedLen };
                            cm.setCursor(newPos);
                        }
                    });
                });
        }
        hints.sort((a, b) => a.displayText.localeCompare(b.displayText));
        const start = token.start;
        const end = token.end;
        return {
            list: hints.slice(0, 12),
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
        };
    }

    // Register hint helper globally
    if (typeof CodeMirror !== 'undefined') {
        CodeMirror.registerHelper('hint', 'custom', getLanguageHints);
    }

    // --- Editor Initialization ---
    if (editorElement && typeof CodeMirror !== 'undefined') {
        const mode = editorElement.getAttribute('data-mode') || 'text/x-csrc';
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        
        window.editor = CodeMirror.fromTextArea(editorElement, {
            mode: mode,
            theme: 'dracula',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: !isMobile,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            smartIndent: true,
            electricChars: true,
            lineWrapping: isMobile,
            viewportMargin: isMobile ? 10 : 50,
            styleActiveLine: !isMobile,
            foldGutter: !isMobile,
            gutters: isMobile ? ["CodeMirror-linenumbers"] : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            autoCloseTags: true,
            highlightSelectionMatches: isMobile ? false : { showToken: /\w/, annotateScrollbar: false },
            matchTags: !isMobile ? { bothTags: true } : false,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-/": "toggleComment",
                "Cmd-/": "toggleComment",
                "Ctrl-D": function (cm) {
                    const cursor = cm.getCursor();
                    const line = cm.getLine(cursor.line);
                    cm.replaceRange("\n" + line, { line: cursor.line, ch: line.length });
                },
                "Cmd-D": function (cm) {
                    const cursor = cm.getCursor();
                    const line = cm.getLine(cursor.line);
                    cm.replaceRange("\n" + line, { line: cursor.line, ch: line.length });
                },
                "Shift-Alt-F": function (cm) {
                    const totalLines = cm.lineCount();
                    for (let i = 0; i < totalLines; i++) {
                        cm.indentLine(i, "smart");
                    }
                },
                "Ctrl-S": function (cm) {
                    // Prevent default save and format instead
                    const totalLines = cm.lineCount();
                    for (let i = 0; i < totalLines; i++) {
                        cm.indentLine(i, "smart");
                    }
                },
                "Cmd-S": function (cm) {
                    const totalLines = cm.lineCount();
                    for (let i = 0; i < totalLines; i++) {
                        cm.indentLine(i, "smart");
                    }
                },
                "Tab": function (cm) {
                    const cursor = cm.getCursor();
                    const line = cm.getLine(cursor.line);
                    const word = line.slice(0, cursor.ch).split(/\s/).pop();

                    let lang = 'c';
                    const dataMode = editorElement.getAttribute('data-mode') || '';
                    if (dataMode.includes('python')) lang = 'python';
                    else if (dataMode.includes('java') && !dataMode.includes('javascript')) lang = 'java';
                    else if (dataMode.includes('javascript')) lang = 'javascript';
                    else if (dataMode.includes('c++') || dataMode.includes('cpp')) lang = 'cpp';
                    else if (dataMode.includes('php')) lang = 'php';

                    const snippets = codeSnippets[lang] || {};
                    if (snippets[word]) {
                        const from = { line: cursor.line, ch: cursor.ch - word.length };
                        let snippet = snippets[word].replace(/\$\{\d+:([^}]*)\}/g, '$1');
                        cm.replaceRange(snippet, from, cursor);
                        return;
                    }

                    if (cm.somethingSelected()) {
                        cm.indentSelection("add");
                    } else {
                        cm.replaceSelection(cm.getOption("indentWithTabs") ? "\t" : Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
                    }
                },
                "Shift-Tab": function (cm) {
                    cm.indentSelection("subtract");
                },
                "Enter": function (cm) {
                    const cursor = cm.getCursor();
                    const line = cm.getLine(cursor.line);
                    const trimmed = line.trim();

                    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(') || trimmed.endsWith(':')) {
                        const indent = line.match(/^\s*/)[0];
                        const extraIndent = cm.getOption("indentWithTabs") ? "\t" : Array(cm.getOption("indentUnit") + 1).join(" ");
                        const nextChar = cm.getRange(cursor, { line: cursor.line, ch: cursor.ch + 1 });
                        if (nextChar === '}' || nextChar === ']' || nextChar === ')') {
                            cm.replaceSelection("\n" + indent + extraIndent + "\n" + indent, "end");
                            cm.setCursor({ line: cursor.line + 1, ch: (indent + extraIndent).length });
                        } else {
                            cm.replaceSelection("\n" + indent + extraIndent, "end");
                        }
                    } else {
                        cm.execCommand("newlineAndIndent");
                    }
                },
                "Alt-Up": !isMobile ? function (cm) {
                    const cursor = cm.getCursor();
                    if (cursor.line === 0) return;
                    const line = cm.getLine(cursor.line);
                    const prevLine = cm.getLine(cursor.line - 1);
                    cm.replaceRange(line + "\n" + prevLine, { line: cursor.line - 1, ch: 0 }, { line: cursor.line, ch: line.length });
                    cm.setCursor({ line: cursor.line - 1, ch: cursor.ch });
                } : undefined,
                "Alt-Down": !isMobile ? function (cm) {
                    const cursor = cm.getCursor();
                    if (cursor.line >= cm.lineCount() - 1) return;
                    const line = cm.getLine(cursor.line);
                    const nextLine = cm.getLine(cursor.line + 1);
                    cm.replaceRange(nextLine + "\n" + line, { line: cursor.line, ch: 0 }, { line: cursor.line + 1, ch: nextLine.length });
                    cm.setCursor({ line: cursor.line + 1, ch: cursor.ch });
                } : undefined
            },
            hintOptions: {
                hint: getLanguageHints,
                completeSingle: false,
                alignWithWord: true,
                closeOnUnfocus: true
            }
        });

        // Auto-complete triggers
        const autoCompleteDelay = isMobile ? 300 : 150;
        let autoCompleteTimeout;
        window.editor.on('inputRead', function (cm, change) {
            if (change.text[0] && /^[a-zA-Z_]$/.test(change.text[0])) {
                clearTimeout(autoCompleteTimeout);
                autoCompleteTimeout = setTimeout(function () {
                    if (!cm.state.completionActive) {
                        cm.showHint({ hint: getLanguageHints, completeSingle: false });
                    }
                }, autoCompleteDelay);
            }
        });

        // Status bar updates
        let cursorTimeout;
        window.editor.on('cursorActivity', () => {
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => {
                const pos = window.editor.getCursor();
                const statusCursor = document.getElementById('status-cursor');
                if (statusCursor) {
                    statusCursor.textContent = `Ln ${pos.line + 1}, Col ${pos.ch + 1}`;
                }
            }, 50);
        });
    } else if (!editorElement) {
        // console.warn('Code editor element not found'); // Normal for non-editor pages
    } else if (typeof CodeMirror === 'undefined') {
        console.error('CodeMirror library not loaded');
    }
});
