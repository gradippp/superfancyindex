# superfancyindex

Simple theme for nginx fancyindex module.

This is forked from https://github.com/ShaneMcC/nginx-fancyindex-theme

## Usage

Create a directory /.index/ within your webroot, and copy the `theme` directory from this repo into it.

Add the following to the nginx config.

```
	fancyindex on;
	fancyindex_exact_size off;
	fancyindex_localtime on;
	fancyindex_header "/.index/theme/header.html";
	fancyindex_footer "/.index/theme/footer.html";
```

## Customisation

Edit the `theme/header.html` file to change the page title, add content to the opengraph meta tags, or set a favicon.

Edit the `theme/footer.html` file to change the page footer text.

Edit `theme/theme.css` to change the default accent colour (`#3747bb`) to a different one.

If you want to enable a god-awful bit of functionality, you can edit `theme/script.js` to uncomment the `replaceHTML();` call that allows per-directory `HEADER.html` and `FOOTER.html` files to be used in place of this index where they exist.

## Demo

A slightly-customised version of this is in use at https://mirrors.melbourne.co.uk/

## Acknowledgements

Visual inspiration from https://github.com/alehaa/nginx-fancyindex-flat-theme
