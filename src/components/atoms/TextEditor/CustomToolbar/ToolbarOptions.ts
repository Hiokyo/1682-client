
const colors = [ 'White', 'Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'Gray', 'Orange', 'Brown'];
const formats = [
    [
        {
            className:'ql-font',
            options:['serif','monospace']
        },
        {
            className:'ql-size',
            options:['small','large','huge']
        }
    ],
    [
        { className:'ql-bold' },{ className:'ql-italic' },{ className:'ql-underline' },{ className:'ql-strike' }
    ],
    [
        {
            className:'ql-color',
            options:colors
        }
    ],
    [
        {
            className:'ql-header',
            value:'1'
        },
        {
            className:'ql-header',
            value:'2'
        },
        {
            className:'ql-blockquote'
        }
    ],
    [
        {
            className:'ql-list',
            value:'ordered'
        },
        {
            className:'ql-list',
            value:'bullet'
        },
        {
            className:'ql-indent',
            value:'-1'
        },
        {
            className:'ql-indent',
            value:'+1'
        }
    ],
    [
        {
            className:'ql-align',
            options:['right','center','justify']
        }
    ],
    [
        { className:'ql-link' }
    ],

];

export default formats;
