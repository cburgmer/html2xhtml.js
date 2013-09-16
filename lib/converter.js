var Parser = require('parse5').Parser;

var cdataBlockTags = ['script', 'style'];

var booleanAttrs = ['checked', 'compact', 'declare', 'defer', 'disabled', 'ismap', 'multiple',
    'nohref', 'noresize', 'noshade', 'nowrap', 'readonly', 'selected'];

var serializeAttribute = function (attr) {
    var value = attr.value;

    if (booleanAttrs.indexOf(attr.name) >= 0) {
        value = attr.name;
    }
    return ' ' + attr.name + '="' + value + '"';
};

var serializeNamespace = function (node) {
    if (node.tagName === 'html') {
         return ' xmlns="' + node.namespaceURI + '"';
    } else {
        return '';
    }
};

var serializeChildren = function (node) {
    return node.childNodes.map(nodeTreeToXHTML).join('');
};

var serializeTag = function (node) {
    var output = '<' + node.tagName;
    output += serializeNamespace(node);

    node.attrs.forEach(function (attr) {
        output += serializeAttribute(attr);
    });

    if (node.childNodes.length > 0) {
        output += '>';

        if (cdataBlockTags.indexOf(node.tagName) >= 0) {
            output += '<![CDATA[\n';
            output += serializeChildren(node);
            output += '\n]]>';
        } else {
            output += serializeChildren(node);
        }

        output += '</' + node.tagName + '>';
    } else {
        output += '/>';
    }
    return output;
};

var nodeTreeToXHTML = function (node) {
    if (node.nodeName === '#document'
        || node.nodeName === '#document-fragment') {
        return serializeChildren(node);
    } else {
        if (node.tagName) {
            return serializeTag(node);
        } else if (node.nodeName === '#text') {
            return node.value;
        } else if (node.nodeName === '#comment') {
            return '<!--' + node.data + '-->';
        }
    }
};

var parseHTML5 = function (content) {
    var parser = new Parser();
    return parser.parse(content);
}

exports.html2xhtml = function (content) {
    var nodeTree = parseHTML5(content);

    return nodeTreeToXHTML(nodeTree);
};