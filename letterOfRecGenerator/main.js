const saveAs = require('file-saver');
const quillToWord = require('quill-to-word');
global.window.saveAs = saveAs;
global.window.quillToWord = quillToWord;