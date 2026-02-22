import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Tokens, Token, Marked, Tokenizer, MarkedExtension, marked, Parser, Lexer, TokenizerAndRendererExtension, lexer, parser, MarkedOptions, Renderer, TokenizerExtension, RendererThis, TokenizerThis, TokensList, TokenizerExtensionFunction, RendererExtension, TokenizerObject } from 'marked'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-extending.mark.02',
  imports: [
    RouterLink
  ],
  templateUrl: './extending.mark.02.html',
  styleUrl: './extending.mark.02.scss',
})
export class ExtendingMark02 implements OnInit, AfterViewInit, OnDestroy {

  protected readonly className = signal('ExtendingMark02');
  private readonly $isBrowser = signal<boolean>(false);

  private Lexer = new Lexer();

  private divEl: HTMLElement | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this.$isBrowser.set(isBrowser);

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


    if (this.$isBrowser()) {

      const md =
        '&emsp; $ N^2 latex code $ \n &emsp; `other code` \n\n' +
        '# heading 2 \n## heading 3 \n\n' +
        'A Description List:\n\n' +
        ': Topic 1   :  Description 1\n' +
        ': **Topic 2** : ___Description 2___ \n\n';


      this.divEl = document.getElementById('example2');

      if (!this.divEl) return;
      this.divEl.innerHTML = '';// initialize

      // 1. Tokenizer
      console.log(`1. Tokenizer`);
      // Override function
      const tokenizer: TokenizerObject = {
        codespan(src: string) {
          const match = src.match(/^\$+([^\$\n]+?)\$+/);
          if (match) {
            return {
              type: 'codespan',
              raw: match[0],
              text: 'tokernizer(' + match[1].trim() + ')'
            };
          }

          // return false to use original codespan tokenizer
          return false;
        }
      };

      // 2. Walk Tokens
      console.log(`2. Walk Tokens`);

      // Override function
      const walkTokens = (token: Token) => {
        if (token.type === 'heading') {
          token.depth += 1;
          token.text = 'walkedHeading(' + token.text + ')';
          token.tokens = this.Lexer.inlineTokens(token.text)
        }
        if (token.type === 'strong') {
          token.text = 'walkedStrong(' + token.text + ')';
          token.tokens = this.Lexer.inlineTokens(token.text)
        }
      };

      // 3. Extensions
      console.log(`3. Extensions: 1) descriptionList`);

      const descriptionList: TokenizerAndRendererExtension<string, string> = {
        name: 'descriptionList',
        level: 'block',                                     // Is this a block-level or inline-level tokenizer?
        start(src: string) { return src.match(/:[^:\n]/)?.index; }, // Hint to Marked.js to stop and check for a match
        tokenizer(src: string, tokens: TokensList | Token[]) {
          // tokenizer(src: string, tokens: TokensList | Token[]) {
          const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
          const match = rule.exec(src);
          // console.log(`descriptionList tokenizer tokens`, tokens);

          if (match) {
            const token = {                                 // Token to generate
              type: 'descriptionList',                      // Should match "name" above
              raw: match[0],                                // Text to consume from the source
              text: match[0].trim(),                        // Additional custom properties
              tokens: []                                    // Array where child inline tokens will be generated
            };
            this.lexer.inline(token.text, token.tokens);    // Queue this data to be processed for inline tokens
            return token;
          }

          return undefined;
        },
        renderer(token: Tokens.Generic) {
          if (!token.tokens) return undefined;
          return `<dl>${this.parser.parseInline(token.tokens)}\n</dl>`; // parseInline to turn child tokens into HTML
        }
      };

      console.log(`3. Extensions: 2) description`);

      const description: TokenizerAndRendererExtension = {
        name: 'description',
        level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
        start(src: string) { return src.match(/:/)?.index; },    // Hint to Marked.js to stop and check for a match

        tokenizer(src: string, tokens: TokensList | Token[]) {
          const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
          const match = rule.exec(src);

          // console.log(`description tokenizer tokens`, src, tokens);

          if (match) {
            return {                               // Token to generate
              type: 'description',                           // Should match "name" above
              raw: match[0],                                 // Text to consume from the source
              dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
              dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens}
            }
          }
          return undefined;
        },
        renderer(token: Tokens.Generic) {
          if (!token.tokens) return undefined;
          return `\n<dt>${this.parser.parseInline(token['dt'])}</dt><dd>${this.parser.parseInline(token['dd'])}</dd>`;
        },

        childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
      };

      const markedExtension: MarkedExtension<string, string> = {
        extensions: [descriptionList],
        renderer: new Renderer(),
        tokenizer: tokenizer,
        walkTokens: walkTokens
      }

      marked.use(markedExtension);

      const parsedAll = marked.parse(md, { async: false });
      // Results
      this.divEl.innerHTML = parsedAll

    }

  }

  ngOnDestroy(): void {
    this.divEl = null;

  }


}
