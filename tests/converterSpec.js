var html2xhtml = require('../lib/converter').html2xhtml;

describe('html2xhtml', function () {
    var withXHTMLBoilerplate = function (body, head) {
        var document = '<html xmlns="http://www.w3.org/1999/xhtml">';
        if (head) {
            document += '<head>' + head + '</head>';
        } else {
            document += '<head/>';
        }
        if (body) {
            document += '<body>' + body + '</body>';
        } else {
            document += '<body/>';
        }
        document += '</html>';
        return document;
    }

    var emptyDocument = function () {
        return withXHTMLBoilerplate();
    }

    it('should return a valid XHTML document for empty input', function() {
        expect(html2xhtml('')).toEqual(emptyDocument());
    });

    it('should return a valid XHTML document for HTML', function () {
        var xhtml = html2xhtml('<html></html>');

        expect(xhtml).toEqual(emptyDocument());
    });

    it('should serialize comments', function () {
        var xhtml = html2xhtml('<!-- this is a comment -->');

        expect(xhtml).toEqual('<!-- this is a comment -->' + emptyDocument());
    });

    it('should correctly serialize special characters in comments', function () {
        var xhtml = html2xhtml('<!-- &gt; -->');

        expect(xhtml).toEqual('<!-- &gt; -->' + emptyDocument());
    });

    it('should quote dashes in comments', function () {
        var xhtml = html2xhtml('<!--- -- - - ---- --->');

        expect(xhtml).toEqual('<!--&#45; &#45;&#45; &#45; &#45; &#45;&#45;&#45;&#45; &#45;-->' + emptyDocument());
    });

    it('should serialize attributes', function () {
        var xhtml = html2xhtml('<p class="myClass"> </p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize text', function () {
        var xhtml = html2xhtml('<p> this is text</p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p> this is text</p>'));
    });

    it('should serialize to lower case tag names', function () {
        var xhtml = html2xhtml('<P> </P>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p> </p>'));
    });

    it('should serialize to lower case attribute names', function () {
        var xhtml = html2xhtml('<p Class="myClass"> </p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize HTML enties', function () {
        var xhtml = html2xhtml('&ndash;');

        expect(xhtml).toEqual(withXHTMLBoilerplate('–'));
    });

    it('should correctly quote ampersand', function () {
        var xhtml = html2xhtml('&amp;&amp;');

        expect(xhtml).toEqual(withXHTMLBoilerplate('&amp;&amp;'));
    });

    it('should correctly quote lighter than', function () {
        var xhtml = html2xhtml('&lt;&lt;');

        expect(xhtml).toEqual(withXHTMLBoilerplate('&lt;&lt;'));
    });

    it('should correctly quote greater than', function () {
        var xhtml = html2xhtml('&gt;&gt;');

        expect(xhtml).toEqual(withXHTMLBoilerplate('&gt;&gt;'));
    });

    it('should correctly serialize special characters in attributes', function () {
        var xhtml = html2xhtml('<input value="&quot;&gt;&lt;&amp;&apos;"/>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<input value="&quot;&gt;&lt;&amp;&apos;"/>'));
    });

    it('should serialize to self closing attribute', function () {
        var xhtml = html2xhtml('<br/>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<br/>'));
    });

    it('should put script content into CDATA blocks', function () {
        var xhtml = html2xhtml('<script>var a = 1 & 1;</script>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('',
            '<script><![CDATA[\nvar a = 1 & 1;\n]]></script>'));
    });

    it('should put script content into CDATA blocks', function () {
        var xhtml = html2xhtml('<style>span:before { content: "<"; }</style>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('',
            '<style><![CDATA[\nspan:before { content: "<"; }\n]]></style>'));
    });

    it('should convert boolean attributes', function () {
        var xhtml = html2xhtml('<input type="checkbox" checked/>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<input type="checkbox" checked=""/>'));
    });

    it('should prefer existing xmlns', function () {
        var xhtml = html2xhtml('<html xmlns="somenamespace"></html>');

        expect(xhtml).toEqual('<html xmlns="somenamespace"><head/><body/></html>');
    });
});
