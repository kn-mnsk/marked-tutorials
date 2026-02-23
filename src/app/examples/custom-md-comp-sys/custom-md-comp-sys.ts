import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Tokens, Token, Marked, Tokenizer, MarkedExtension, marked, Parser, Lexer, TokenizerAndRendererExtension, lexer, parser, MarkedOptions, Renderer, TokenizerExtension, RendererThis, TokenizerThis, TokensList, TokenizerExtensionFunction, RendererExtension } from 'marked'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-custom-md-comp-sys',
  imports: [
    RouterLink
  ],
  templateUrl: './custom-md-comp-sys.html',
  styleUrl: './custom-md-comp-sys.scss',
})
export class CustomMdCompSys implements OnInit, AfterViewInit, OnDestroy {

  protected readonly className = signal('CustomMdCompSys');
  private readonly $isBrowser = signal<boolean>(false);

  private Lexer = new Lexer();
  // private noteExtension: MarkedExtension = {
  //   extensions: [
  //     {
  //       name: "component-block",
  //       level: "block", // block-level tokenizer
  //       start(src) {
  //         return src.match(/:::/)?.index;
  //       },
  //       tokenizer(src, tokens) {
  //         const rule = /^:::(\w+)\n([\s\S]+?)\n:::/;
  //         const match = rule.exec(src);

  //         if (match) {
  //           const token = {
  //             type: "component-block",
  //             raw: match[0],
  //             component: match[1],
  //             text: match[2].trim(),
  //             tokens: []
  //           };
  //           this.lexer.inline(token.text, token.tokens);

  //           return token;
  //         }

  //       },

  //     }
  //   ]
  // };

  constructor(@Inject(PLATFORM_ID) platformId: Object,
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this.$isBrowser.set(isBrowser);

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {



    // const noteExtension: MarkedExtension = {
    //   extensions: [
    //     {
    //       name: "componentblock",
    //       level: "block", // block-level tokenizer
    //       start(src) {
    //         return src.match(/:::/)?.index;
    //       },
    //       tokenizer(src, tokens) {
    //         const rule = /^:::(\w+)\n([\s\S]+?)\n:::/;
    //         const match = rule.exec(src);
    //         const token = {
    //           type: "componentblock",
    //           raw: '',
    //           component: '',
    //           text: '',
    //           tokens: []
    //         };
    //         if (match) {
    //           token.raw = match[0];
    //           token.component = match[1];
    //           token.text = match[2].trim();
    //         }
    //         this.lexer.inline(token.text, token.tokens);
    //         return token;
    //       },
    //       renderer(token: any) {
    //         return `<aside class="${token.component}">${marked.parse(token.text)}</aside>`;
    //       },
    //       childTokens: ['componentblock'],
    //     }
    //   ]
    // };

    if (this.$isBrowser()) {

      const divEl = document.getElementById('example1');
      if (!divEl) return;

      // 1. Tokenizer
      console.log(`1. Tokenizer`);
      // Override function
      const tokenizer: any = {
        codespan(src: any) {
          const match = src.match(/^\$+([^\$\n]+?)\$+/);
          if (match) {
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

      marked.use({ async: false, tokenizer });

      const parsedTokenizer = marked.parse('$ N^2 latex code $\n\n` other code `');
      // Run marked
      console.log(parsedTokenizer);
      // divEl.innerHTML = parsedTokenizer;

      // 2. Walk Tokens
      console.log(`2. Walk Tokens`);

      // Override function
      const walkTokens_a = (token: any) => {
        if (token.type === 'heading') {
          token.depth += 1;
        }
      };

      // marked.use({ walkTokens_a });
      // Run marked
      // const parsedWalkToken = marked.parse('# heading 2 \n## heading 3');

      // console.log(parsedWalkToken);

      // 3. Extensions
      console.log(`3. Extensions: 1) descriptionList`);

      const descriptionList: TokenizerAndRendererExtension<string, string> = {
        // const descriptionList: RendererExtension<string, string> | TokenizerExtension = {
        name: 'descriptionList',
        level: 'block',                                     // Is this a block-level or inline-level tokenizer?
        start(src: string) { return src.match(/:[^:\n]/)?.index; }, // Hint to Marked.js to stop and check for a match
        tokenizer(src: string, tokens: TokensList | Token[]) {
          // tokenizer(src: string, tokens: TokensList | Token[]) {
          const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
          const match = rule.exec(src);
          console.log(`descriptionList tokenizer tokens`, tokens);

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

          console.log(`description tokenizer tokens`, src, tokens);

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

      console.log(`3. Extensions: 3) walk tokens`);

      const walkTokens = (token: any) => {                        // Post-processing on the completed token tree
        if (token.type === 'strong') {
          token.text += ' walked';
          token.tokens = this.Lexer.inlineTokens(token.text)
        }
      }

      // marked.use({ extensions: [descriptionList, description], walkTokens });

      // EQUIVALENT TO:
      console.log(`3. Extensions: 4) run marked: descriptionList`);
      marked.use({ extensions: [descriptionList] , async: false});

      console.log(`3. Extensions: 5) run marked: description`);
      marked.use({ extensions: [description], async: false });

      console.log(`3. Extensions: 6) run marked: walkTokens`);
      marked.use({ walkTokens, async: false })

      const parsedExtension = marked.parse('\n\n&emsp;A Description List\n'
        + '\n&emsp; __Topic 1__     Description 1 \n'
        + '&emsp; **Topic 2**  ***Description 2***', {async: false});
      console.log(parsedExtension);


      // Results
      divEl.innerHTML = parsedTokenizer +  parsedExtension;

    }

  }

  ngOnDestroy(): void {

  }


}
