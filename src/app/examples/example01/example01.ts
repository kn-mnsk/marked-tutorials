import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Token, Lexer, Renderer, Marked, TokensList, Tokens, MarkedExtension, TokenizerObject, HooksObject, Hooks, MarkedOptions } from 'marked'
import { RouterLink } from '@angular/router';
import { BlockList } from 'node:net';
import fm, { FrontMatterResult, FrontMatterOptions } from 'front-matter';

import {sanitize, clearWindow} from 'isomorphic-dompurify';

import { KatexService } from '../katex.service';

@Component({
  selector: 'app-example01',
  imports: [
    RouterLink
  ],
  templateUrl: './example01.html',
  styleUrl: './example01.scss',
})
export class Example01 implements OnInit, AfterViewInit, OnDestroy {

  protected readonly $className = signal('Example01');
  private readonly $isBrowser = signal<boolean>(false);

  private marked: Marked | null = null
  private Lexer: Lexer | null = null;
  private divEl1011: HTMLElement | null = null;
  private divEl1012: HTMLElement | null = null;
  private divEl102: HTMLElement | null = null;
  private divEl103: HTMLElement | null = null;
  private divEl1041: HTMLElement | null = null;
  private divEl1042: HTMLElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private katexService: KatexService,
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this.$isBrowser.set(isBrowser);

  }

  ngOnInit(): void { }

  async ngAfterViewInit(): Promise<void> {

    if (!this.$isBrowser()) return;

    this.marked = new Marked();
    this.Lexer = new Lexer();


    /** Example 1-1 The Renderer : renderer  */

    /** Example 1-1-1
     * Overriding output of the default heading token by adding an embedded anchor tag like on GitHub.
    */

    this.divEl1011 = document.getElementById('example111');

    if (!this.divEl1011) return;
    this.divEl1011.innerHTML = '';// initialize

    // markdown file
    const md1011 = `# heading+`;

    // Override function
    const renderer112: any = {
      heading(tokens: Tokens.Heading) {
        // heading({ tokens, depth}) {
        const text = this.parser.parseInline(tokens.tokens);
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        // console.log(`Log: ${this.$className} Example1-1: \ntext=`, text, `\nescaped Text=`, escapedText);

        return `
            <h${tokens.depth}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${tokens.depth}>`;
      }
    };

    this.marked.use({ renderer: renderer112 });

    // run marked
    const html1011 = await this.marked.parse(md1011);
    this.divEl1011.innerHTML = html1011;


    /**Example 1-1-2
     * Calling marked.use() in the following way will avoid overriding the heading token output but create a new heading renderer in the process.
    */

    this.divEl1012 = document.getElementById('example112');

    if (!this.divEl1012) return;
    this.divEl1012.innerHTML = '';// initialize

    // markdown file
    const md1012 = `# heading+`;

    this.marked.use({
      extensions: [{
        name: 'heading',
        renderer(token: Tokens.Generic) {
          return `
            <h${token['depth']}>
              ${token['text']}
            </h${token['depth']}>`;
        }
      }]
    })


    // run marked
    const html1012 = await this.marked.parse(md1012);
    this.divEl1012.innerHTML = html1012;


    /** Example 1-2 Overriding default codespan tokenizer to include LaTeX.
     * Note: Latex does not Work
     */

    this.divEl102 = document.getElementById('example12');

    if (!this.divEl102) return;
    this.divEl102.innerHTML = '';// initialize

    // markdown file
    const md102 = `
latex code: $E = CM^{2}$
other code
`;


    // Override function
    const tokenizer102: TokenizerObject<string, string> = {
      codespan(src: string) {
        const match = src.match(/^\$+([^\$\n]+?)\$+/);
        if (match) {
          console.log(`Log: Example1-2 tokenizer match`, match);
          return {
            type: 'codespan',
            raw: match[0],
            text: match[1].trim()
          };
        }

        // return false to use original codespan tokenizer
        return false;
      }
    };


    this.marked.use({ async: true, breaks: true, gfm: true, tokenizer: tokenizer102 });

    // run marked
    const html102 = await this.marked.parse(md102);
    this.divEl102.innerHTML = html102;


    /** Example 1-3 Walk Tokens : walkTokens
     *
    * Overriding heading tokens to start at h2.
    */

    this.divEl103 = document.getElementById('example13');

    if (!this.divEl103) return;
    this.divEl103.innerHTML = '';// initialize

    // markdown file
    const md103 = '# heading 2\n\n## heading 3';

    // Override function
    const walkTokens103 = (token: Token) => {
      if (token.type === 'heading') {
        token.depth += 1;
      }
    };
    this.marked.use({ walkTokens: walkTokens103 });

    // run marked
    const html103 = await this.marked.parse(md103);
    this.divEl103.innerHTML = html103;


    /** Example 1-4 Hooks : hooks
        * Overriding heading tokens to start at h2.
        */

    this.divEl1041 = document.getElementById('example141');

    if (!this.divEl1041) return;
    this.divEl1041.innerHTML = '';// initialize

    //     const md104 =`
    // ---
    // breaks: true
    // ---

    // line1
    // line2
    // `.trim();
    const md1041 = `
---
title: usage example of front-matter
async: true
breaks: true
---

line1
line2
`.trim();

    let title: string = '';
    // Override function
    const hooks: HooksObject<string, string> = {

      preprocess: function (markdown: string): string | Promise<string> {

        // const { attributes, body } = fm<any>(markdown);
        const { attributes, body, bodyBegin, frontmatter } = fm<{ title: string, async: true, breaks: boolean }>(markdown);

        // console.log(`Log:  \nattributes=`, attributes, `\nbody=`, body, `\nthis.options=`, this.options, `\nmd104`, md104);

        for (const prop in attributes) {
          // console.log(`Log:  \nprop=`, prop);

          console.log(`Log:  \nprop=`, prop);
          switch (prop) {
            case 'title': {
              title = attributes.title;
              break;
            }
            case 'breaks': {
              this.options.breaks = attributes.breaks;
              break;
            }
            case 'async': {
              this.options.async = attributes.async;
              break;
            }

          }
        }
        return body;
      }

    }

    this.marked.use({ gfm: true, hooks });

    // run marked
    const html1041 = await this.marked.parse(md1041);
    this.divEl1041.innerHTML = `<h4>${title}<h4>` + html1041;



    /** Example 1-5 Overriding postporcess to render Latrex with Katex.
    */

    this.divEl1042 = document.getElementById('example142');

    if (!this.divEl1042) return;
    this.divEl1042.innerHTML = '';// initialize

    // markdown file
    const md1042 = `
### Geometry of Space Curve

1. __Length of the smooth space curve C:__ $L = \\int_{t_0}^{t_p}(\\delta_{jk}\\frac{dX^{j}}{dt}\\frac{dX^{k}}{dt})^{1/2}dt$

`;

    // Override function - sanitize and latex
    const hooks1042: HooksObject<string, string> = {

      postprocess: (htmlStr: string): string | Promise<string> => {

        // sanitize
        // const sanitizedHtml =  sanitize(htmlStr)
        // clearWindow();

        const divEl = document.createElement('div');
        divEl.innerHTML = htmlStr;
        // divEl.innerHTML = sanitizedHtml;
        this.katexService.renderMath(divEl);

        console.log(`Log: Example1-4-2 preprocess  html`, divEl);
        return divEl.innerHTML;
        // return html;
      }
    }



    this.marked.use({ async: true, breaks: true, gfm: true, hooks: hooks1042 });

    // run marked
    const html1042 = await this.marked.parse(md1042);
    this.divEl1042.innerHTML = html1042;


  }


  ngOnDestroy(): void {
    if (this.marked) {
      this.marked = null;
    }
    if (this.Lexer) {
      this.Lexer = null;
    }
    this.divEl1011 = null;
    this.divEl1012 = null;
    this.divEl102 = null;
    this.divEl103 = null;
    this.divEl1041 = null;
    this.divEl1042 = null;

  }

}
