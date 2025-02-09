# superfancyindex

Simple theme for nginx fancyindex module.

## Usage

-   Clone this repository, then copy `build.json.example` into `build.json`, and then edit that however you want.
-   Run `npm run build`; This will create the necessary files for your theme at the directory `dist`.
-   Create a directory /.index/ within your webroot, and copy the `dist` directory from this repo into it as `theme`. The final directory that holds all the theme files is going to be `./index/theme/`.

Add the following to the nginx config.

```
	fancyindex on;
	fancyindex_exact_size off;
	fancyindex_localtime on;
	fancyindex_header "/.index/theme/header.html";
	fancyindex_footer "/.index/theme/footer.html";
```

## Customisation

You can customize this according to your own taste by editing the files at `src`.

## Demo

I am using it directly in my public file listing at https://files.agradip.fyi

## Acknowledgements

This is forked from https://github.com/ShaneMcC/nginx-fancyindex-theme
