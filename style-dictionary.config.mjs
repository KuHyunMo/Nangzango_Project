// style-dictionary.config.mjs
import StyleDictionary from 'style-dictionary';
import * as ts from '@tokens-studio/sd-transforms';

// v1/v2/v3 호환: export 이름이 버전에 따라 다름(register or registerTransforms)
const register =
  ts.registerTransforms ||
  ts.register ||
  ts.default?.registerTransforms ||
  ts.default?.register;

if (typeof register === 'function') {
  register(StyleDictionary);
} else {
  console.warn('[warn] tokens-studio transforms not registered; using base transforms only.');
}

// === v5 규칙: 필터는 이름으로 등록하고 config에 문자열로 참조 ===
StyleDictionary.registerFilter({
  name: 'filter-core-or-light',
  matcher: (token) => token.path?.[0] === 'core' || token.path?.[0] === 'light',
});

StyleDictionary.registerFilter({
  name: 'filter-dark',
  matcher: (token) => token.path?.[0] === 'dark',
});

export default {
  source: ['tokens.json'],        // ← 실제 경로와 맞춰주세요
  platforms: {
    css: {
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/typography/fontWeight',
        'name/cti/kebab',
      ],
      buildPath: 'styles/',
      files: [
        {
          destination: 'tokens.light.css',
          format: 'css/variables',
          filter: 'filter-core-or-light',        // ← 함수 대신 "이름"
          options: { selector: ':root' },
        },
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          filter: 'filter-dark',                 // ← 이름
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
  },
};
