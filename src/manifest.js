module.exports = {
  name: 'SJ Ingen sol',
  version: '1.0.0',
  description:
    'An extension to avoid sitting in the sunlight when riding SJ trains',
  author: 'Sebastian Andréasson',
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  permissions: ['<all_urls>', '*://*/*', 'activeTab', 'tabs', 'background'],
  content_scripts: [
    {
      js: ['js/inject.js'],
      run_at: 'document_end',
      matches: ['<all_urls>'],
      all_frames: true,
    },
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: ['panel.html', 'js/content.js'],
}
