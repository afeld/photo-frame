# Photo Frame

This is a photo carousel that rotates through your recent Facebook photos, intended for use in DIY digital photo frame. It should work fine in a cheap tablet or any other device, as long as it has a modern browser.

The app is built in React and TypeScript.

## Usage

This app is well-suited for a cheap tablet, such as a Kindle Fire. To keep Kindle Fire from sleeping:

1. [Enable Developmer mode](https://developer.amazon.com/docs/fire-tablets/connecting-adb-to-device.html#enable-adb-on-your-fire-tablet)
1. Go to `Developer options`
1. Turn `On`
1. Enable `Stay awake`

## Privacy

While the application authenticates with Facebook and requests basic+photo permissions, no data is stored by the application itself. Note that the [Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/) may set some cookies, etc.

## Attribution

Logo adapted from the [`images` Font Awesome icon](https://fontawesome.com/icons/images?style=regular) ([license](https://fontawesome.com/license)).
