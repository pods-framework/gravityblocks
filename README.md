# Pods + Gutenberg

The Pods team is working on bringing Pods into the new WordPress editor, Gutenberg.

This repository contains the development version of the Pods Gutenberg Add-On, which bundles together all of the Pods blocks into one plugin. This repository will be updated upon each public release of the Gutenberg Add-On.

## Packaging for Release

You can use the following command to package up the repository into an installable plugin:

```
zip -r pods-gutenberg-blocks_1.0.zip pods-gutenberg-blocks -x *.git* *.jsx*  *.babelrc* *.DS_Store* pods-gutenberg-blocks/js/components/\* pods-gutenberg-blocks/sass/\* */\node_modules/\* *package-lock.json *README.md  *webpack.config.js
```