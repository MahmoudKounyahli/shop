import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `
    <span class="inline-block text-xs tracking-widest uppercase px-2 py-0.5 bg-black text-white">
      {{ label() }}
    </span>
  `,
})
export class BadgeComponent {
  label = input.required<string>();
}
