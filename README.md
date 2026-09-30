# preb

Headertags en supply-chain bestanden voor het Prebid-adserver project, gegenereerd en gedeployd met de **Prebid Stack Builder**.

## Structuur

| Map | Inhoud |
|---|---|
| `tags/<site>/headertag.js` | Prebid.js + GPT headertag per site |
| `adstxt/<site>/ads.txt` | ads.txt per site |
| `sellersjson/sellers.json` | sellers.json |
| `config/<site>/prebid-config.json` | Volledige configuratie (importeerbaar in de Stack Builder) |

## Embed

```html
<script src="https://raw.githubusercontent.com/jurhey/preb/main/tags/<site>/headertag.js" async></script>
```

> Let op: `raw.githubusercontent.com` is prima voor testen, maar niet bedoeld als productie-CDN.
