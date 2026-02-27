import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Token, Lexer, Renderer, Marked, TokensList, Tokens } from 'marked'
import { RouterLink } from '@angular/router';
import { BlockList } from 'node:net';

@Component({
  selector: 'app-example03',
  imports: [
    RouterLink
  ],
  templateUrl: './example03.html',
  styleUrl: './example03.scss',
})
export class Example03 implements OnInit, AfterViewInit, OnDestroy {

  protected readonly $className = signal('Example03');
  private readonly $isBrowser = signal<boolean>(false);

  private marked: Marked | null = null
  private Lexer: Lexer | null = null;
  private divEl31: HTMLElement | null = null;
  private divEl32: HTMLElement | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this.$isBrowser.set(isBrowser);

  }

  ngOnInit(): void {

  }

  async ngAfterViewInit(): Promise<void> {


    if (this.$isBrowser()) {

      this.marked = new Marked();
      this.Lexer = new Lexer();


      /**
       * 3-1. Simple Example
       */
      this.divEl31 = document.getElementById('example31');

      if (!this.divEl31) return;
      this.divEl31.innerHTML = '';// initialize

      const md31 =
      `[valid link](https://example.com)` +
      `\n` + 
      `[invalid link](https://invalidurl.com)`;

      const walkTokens = async (token: Tokens.Generic) => {
        console.log(`Log: Example03 3-1. Custom Extension Example: walkTokens \ntoken=`, token);

        if (token.type === 'link') {

          try {
            const response = await fetch('http://localhost:4200/api/exampleCom');

            console.log(`Log: Example03 3-1. Custom Extension Example: walkTokens \ntoken=`, token, `\nfetched url=`, response.url);
            // await fetch(token.href);
            token['title'] = 'valid';

          } catch (ex) {
            token['title'] = 'invalid';
            // token.title = 'invalid';

          }
          token.tokens = this.Lexer?.inlineTokens(token['text'])
          // token.tokens = this.Lexer?.inlineTokens(token.text)

        }
      };

      this.marked.use({
        async: true,
        renderer: new Renderer(),
        walkTokens: walkTokens,
      });

      const html31 = await this.marked.parse(md31);
      this.divEl31.innerHTML = html31;


      /**
       * 3-2. Custome Extension Example:
       */

      this.divEl32 = document.getElementById('example32');

      if (!this.divEl32) return;
      this.divEl32.innerHTML = '';// initialize

      const md32 =
        `# example.com` +
        `\n- __Fetch Response__` +
        `\n:https://example.com:
      `;

      const importUrl = {
        extensions: [{
          name: 'importUrl',
          level: 'block',
          start(src: string) {
            const index = src.indexOf('\n:');
            // const index = src.indexOf('\n:');
            console.log(`Log: Example03 3-2. Custome Extension Example: start`, index);
            return index;
          },
          tokenizer(src: string, tokens: Token[] | TokensList) {
            // console.log(`Log: Example03 3-2. Custome Extension Example: tokenizer entry point \nsrc=`, src, `\ntokens=`, tokens);

            const rule = /^:(https?:\/\/.+?):/;
            const match = rule.exec(src);

            if (match) {
              const res = {
                type: 'importUrl',
                raw: match[0],
                url: match[1],
                html: '' // will be replaced in walkTokens
              };
              console.log(`Log: Example03 3-2. Custome Extension Example: tokenizer \nmatch=`, match, '\nreturn value=', res);
              return res;
            }
            // console.log(`Log: Example03 3-2. Custome Extension Example: tokenizer undefined  \nsrc=`, src,  `\ntokens=`, tokens);
            return undefined;
          },
          renderer(token: Tokens.Generic) {
            console.log(`Log: Example03 3-2. Custome Extension Example: renderer`, token);
            return token['html'];
          }
        }],
        async: true, // needed to tell marked to return a promise
        async walkTokens(token: Tokens.Generic) {
          if (token.type === 'importUrl') {

            // console.log(`Log: Example03 3-2. Custome Extension Example: walkTokens \ntoken=`, token, `\ntoken url=`, token['url']);
            const response = await fetch('http://localhost:4200/api/exampleCom');

            console.log(`Log: Example03 3-2. Custome Extension Example: walkTokens \ntoken=`, token, `\nfetched url=`, response.url);
            token['html'] = await response.text();
          }
        }
      };

      this.marked.use(importUrl);

      const html32 = await this.marked.parse(md32);
      this.divEl32.innerHTML = html32;

    }

  }


  ngOnDestroy(): void {
    if (this.marked) {
      this.marked = null;
    }
    if (this.Lexer) {
      this.Lexer = null;
    }
    this.divEl31 = null;
    this.divEl32 = null;

  }

}
