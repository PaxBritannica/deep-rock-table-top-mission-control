import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FM_ICONS } from './fm-icons.data';

/** Namespace for the app's own SVG icons: use as `<mat-icon svgIcon="fm:frozen" />`. */
export const FM_NS = 'fm';

/** True for icon names from the app's own set ("fm:frozen"), false for Material Symbols ligatures. */
export function isFmIcon(icon: string | null | undefined): icon is string {
  return !!icon && icon.startsWith(`${FM_NS}:`);
}

export function fmIconExists(icon: string): boolean {
  return isFmIcon(icon) && icon.slice(FM_NS.length + 1) in FM_ICONS;
}

/** Registers the bundled icon set (no network requests, works offline). */
export function provideFieldManualIcons(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    for (const [name, svg] of Object.entries(FM_ICONS)) {
      // Our own static SVG strings, generated at build time: safe to trust.
      registry.addSvgIconLiteralInNamespace(FM_NS, name, sanitizer.bypassSecurityTrustHtml(svg));
    }
  });
}
