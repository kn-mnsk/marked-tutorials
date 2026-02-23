import { AfterViewInit, Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Tokens, Token, MarkedExtension, marked, Lexer, TokenizerAndRendererExtension, Renderer, TokensList, TokenizerObject } from 'marked'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-example03',
  imports: [
    RouterLink
  ],
  templateUrl: './example03.html',
  styleUrl: './example03.scss',
})
export class Example03 implements OnInit, AfterViewInit, OnDestroy {

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

  async ngAfterViewInit(): Promise<void> {


    if (this.$isBrowser()) {

      this.divEl = document.getElementById('example3');

      if (!this.divEl) return;
      this.divEl.innerHTML = '';// initialize

      const md = `
        [valid link](https://example.com)

        [invalid link](https://invalidurl.com)
      `;

      const walkTokens = async (token: Token) => {
        if (token.type === 'link') {
          try {
            await fetch(token.href);
            token.title = 'valid';

          } catch (ex) {
            token.title = 'invalid';

          }
          token.tokens = this.Lexer.inlineTokens(token.text)

        }
      };

      marked.use({
        async: true,
        renderer: new Renderer(),
        walkTokens: walkTokens,
      });

      const html = await marked.parse(md);
      this.divEl.innerHTML = html;

    }

  }


  ngOnDestroy(): void {
    marked.use({async: false});
    this.divEl = null;

  }

}
