import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Tokens, Token, MarkedExtension, Marked, Lexer, TokenizerAndRendererExtension, Renderer, TokensList, TokenizerObject, MarkedOptions, HooksObject, Hooks } from 'marked'

import fm, { FrontMatterResult, FrontMatterOptions } from 'front-matter';

@Component({
  selector: 'app-example04',
  imports: [
    RouterLink
  ],
  templateUrl: './example04.html',
  styleUrl: './example04.scss',
})
export class Example04 implements OnInit, AfterViewInit, OnDestroy {

  protected readonly $className = signal('Example04');
  private readonly $isBrowser = signal<boolean>(false);

  private marked: Marked | null = null
  private Lexer: Lexer | null = null;
  private divEl41: HTMLElement | null = null;
  private divEl42: HTMLElement | null = null;
  private divEl43: HTMLElement | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this.$isBrowser.set(isBrowser);

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


    if (this.$isBrowser()) {

      // Example 4-1
      this.marked = new Marked();
      this.Lexer = new Lexer();

      this.divEl41 = document.getElementById('example41');

      if (!this.divEl41) return;
      this.divEl41.innerHTML = '';// initialize


      const md41 = `
        ---
        title: Just hack'n
        description: Nothing to see here
        ---

        This is some text about some stuff that happened sometime ago
        `;


      // Override function
      const preprocess = (md: string): string => {
        const content = fm<any>(md);
        // const content = fm<any[]>(md);
        console.log(`Log: ${this.$className()} content=`, content);

        for (const prop in content.attributes) {
          console.log(`Log: ${this.$className()} prop=`, prop);
          // if (prop in this.options) {
          //   this.options[prop] = content.attributes[prop];
          // }
        }
        return content.body;
      }

      this.marked.use({ hooks: { preprocess } });
      this.divEl41.innerHTML = this.marked.parse(md41, { async: false });


      /**** */
      // Example 4-2
      this.marked = null;
      this.Lexer = null;
      this.marked = new Marked();
      this.Lexer = new Lexer();
      const hooks_ = new Hooks();

      this.divEl42 = document.getElementById('example42');

      if (!this.divEl42) return;
      this.divEl42.innerHTML = '';// initialize

      const md421 = `
        [test]: http://example.com
      `;
      const md422 = `
        [test link][test]
      `;

      let refLinks = {};

      // Override function
      const processAllTokens = (tokens: TokensList | Token[]): TokensList | Token[] => {
        const t = tokens as TokensList
        refLinks = t.links;

        return tokens;
      }

        // `provideLexer?(this: Hooks<string, string>): (<ParserOutput = string, RendererOutput = string>(src: string, options?: MarkedOptions<ParserOutput, RendererOutput>) => Token[]) | Promise<(<ParserOutput = string, RendererOutput = string>(src: string, options?: MarkedOptions<ParserOutput, RendererOutput>) => Token[])>`


      function provideLexer(this: Hooks<string, string>):<ParserOutput = string, RendererOutput = string>(src: string, options?: MarkedOptions<ParserOutput, RendererOutput> | undefined) => Token[] {
        return <ParserOutput = string, RendererOutput = string>(src: string, options: MarkedOptions<ParserOutput, RendererOutput> | undefined) => {

          const lexer = new Lexer(options);
          lexer.tokens.links = refLinks;

          return this.block ? lexer.lex(src) : lexer.inlineTokens(src);
        }
      }

      // Parse reflinks separately from markdown that uses them
      this.marked?.use({ hooks: { processAllTokens, provideLexer } });

      this.divEl42.innerHTML = this.marked.parse(md421, { async: false }) + this.marked.parse(md422, { async: false });


    }
  }

  ngOnDestroy(): void {
    if (this.marked) {
      this.marked = null;
    }
    if (this.Lexer) {
      this.Lexer = null;
    }
    this.divEl42 = null;

  }


}
