import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Tokens, Token, Marked, Tokenizer, MarkedExtension, marked, Parser, Lexer, TokenizerAndRendererExtension, lexer, parser, MarkedOptions, Renderer, TokenizerExtension, RendererThis, TokenizerThis } from 'marked'

@Component({
  selector: 'app-custom-md-comp-sys',
  imports: [],
  templateUrl: './custom-md-comp-sys.html',
  styleUrl: './custom-md-comp-sys.scss',
})
export class CustomMdCompSys implements OnInit, AfterViewInit, OnDestroy {

  protected readonly className = signal('CustomMdCompSys');
  private readonly $isBrowser = signal<boolean>(false);

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

      const descriptionList:TokenizerAndRendererExtension<string, string> | RendererThis<string, string> | TokenizerThis |Lexer<string,  string>= {
        name: 'descriptionList',
        level: 'block',                                     // Is this a block-level or inline-level tokenizer?
        // start(src: any) { return src.match(/:[^:\n]/)?.index; }, // Hint to Marked.js to stop and check for a match
        // parser: null as unknown as Parser<string,  string>,
        // lexer: null as unknown as Lexer<string,  string>,
        tokenizer(src: any, tokens: any) {
          const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
          const match = rule.exec(src);
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
        },
        renderer(token: any) {
          return `<dl>${this.parser.parseInline(token.tokens)}\n</dl>`; // parseInline to turn child tokens into HTML
        }
      };

      const description = {
        name: 'description',
        level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
        start(src: any) { return src.match(/:/)?.index; },    // Hint to Marked.js to stop and check for a match
        tokenizer(src: any, tokens: any) {
          const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
          const match = rule.exec(src);
          if (match) {
            return {                                         // Token to generate
              type: 'description',                           // Should match "name" above
              raw: match[0],                                 // Text to consume from the source
              dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
              // dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
              dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens
            };
          }
        },
        renderer(token: any) {
          return `\n<dt>${this.parser.parseInline(token.dt)}</dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
        },
        childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
      };

      function walkTokens(token: any) {                        // Post-processing on the completed token tree
        if (token.type === 'strong') {
          token.text += ' walked';
          token.tokens = this.Lexer.lexInline(token.text)
        }
      }
      marked.use({ extensions: [descriptionList, description], walkTokens });

      // EQUIVALENT TO:

      marked.use({ extensions: [descriptionList] });
      marked.use({ extensions: [description] });
      marked.use({ walkTokens })

      console.log(marked.parse('A Description List:\n'
        + ':   Topic 1   :  Description 1\n'
        + ': **Topic 2** : *Description 2*'));

    }

  }

  ngOnDestroy(): void {

  }


}
