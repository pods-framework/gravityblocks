# Gravity Forms + Gutenberg

The Gravity Forms team is working on bringing the most advanced form builder into the new WordPress editor, Gutenberg.

This repository contains the development version of the Gravity Forms Gutenberg Add-On, which bundles together all of the Gravity Forms blocks into one plugin. This repository will be updated upon each public release of the Gutenberg Add-On.

## Packaging for Release

You can use the following command to package up the repository into an installable plugin:

```
zip -r gravityformsgutenberg_1.0-beta-3.zip gravityformsgutenberg -x *.git* *.jsx*  *.babelrc* *.DS_Store* gravityformsgutenberg/js/components/\* gravityformsgutenberg/sass/\* */\node_modules/\* *package-lock.json *README.md  *webpack.config.js
```