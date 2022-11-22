## Builders
Helpful builders for various Discord related things.

This module is specifically built to be compatible with [Oceanic](https://github.com/OceanicJS/Oceanic).

Get started by using one of our main classes, [`ComponentBuilder`](#component-builder) or [`EmbedBuilder`](#embed-builder).

### Component Builder
```ts
// const { ComponentBuilder, (...) } = require("@oceanicjs/builders");
import {
	ComponentBuilder,
	ButtonColors,
	Button,
	SelectMenu,
	TextInput,
} from "@oceanicjs/builders";
import {
	ButtonStyles,
	TextInputStyles,
	MessageActionRow,
	ModalActionRow,
    ComponentTypes,
    ChannelTypes
	} from "oceanic.js";

// undefined can be used to skip uneeded parameters - don't use null!
const builder = new ComponentBuilder();

// add an interaction button (styles 1-4)
// style, customID, label, emoji, disabled
builder.addInteractionButton(ButtonStyles.PRIMARY, "some-custom-id", "My Button Label", { id: null, name: "🐾" }, false);
/*
 we have a ButtonColors export - List: 
PRIMARY   = BLURPLE
SECONDARY = GRAY
SUCCESS   = GREEN
DANGER    = RED
LINK      = URL
*/

// add a url button (style 5)
builder.addURLButton({
	disabled: false,
	emoji: { id: "681748079778463796", name: "paws8", animated: false },
	label: "Click Here",
	url: "https://google.com"
});

// for emojis, we have a helper to convert full emoji strings, or code points into a partial emoji (this method is static)
// emoji, type (default/custom)
ComponentBuilder.emojiToPartial("🐾", "default") // { id: null, name: "🐾", animated: false }
ComponentBuilder.emojiToPartial("<:paws8:681748079778463796>", "custom") // { id: "681748079778463796", name: "paws8", animated: false }
ComponentBuilder.emojiToPartial("<a:owoanim:768551122066472990>", "custom") // { id: "768551122066472990", name: "owoanim", animated: true }

// if the current row has a component in it already, this method will automatically create a new row and add the select menu in that row, the create another row for you to continue using in other methods
// add a select menu
builder.addSelectMenu({
    channelTypes: [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_ANNOUNCEMENT],
	customID: "some-custom-id",
	disabled: false,
	maxValues: 3,
	minValues: 1,
	options: [],
	placeholder: "Some Placeholder Here",
    type: ComponentTypes.CHANNEL_SELECT
});
// see https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure for options structure

// add a text input
builder.addTextInput({
	customID: "some-custom-id",
	label: "Some Label Here",
	maxLength: 100,
	minValue: 20,
	placeholder: "Some Placeholder Here",
	required: true,
	style: TextInputStyles.SHORT,
	value: "Initial Value"
});
// currently SHORT & PARAGRAPH exist

// remove all currently present empty rows (this is already done while converting to JSON)
builder.removeEmptyRows();

// convert all of the added content into JSON, ready to be used as a components property in a message/modal
builder.toJSON();

// most things have a Raw variant, which returns json that can be sent directly to Discord
builder.toJSONRaw();


// a few other things, if you want to add a new row at any time, just call..
builder.addRow();
// this also accepts an array of components, if you want to add them while creating the row

// if you want to construct the components yourself, you can add them via these methods
builder.addComponent(new Button(ButtonColors.RED, "some-custom-id"));
// add in bulk (these will be passed through addComponent one at a time, in order)
builder.addComponents([
	new Button(ButtonStyles.LINK, "https://google.com"),
	new SelectMenu("some-custom-id"),
	new TextInput(TextInputStyles.PARAGRAPH, "Some Label", "some-custom-id")
]);
// these classes all come with their own methods to change things about them, please refer to the code for a list of them. They are all well documented.

// if you want to limit the maxium amount of items we'll put in a row to a different number than 5, you can provide that in the ComponentBuilder constructor, or call setRowLimit
const builder3 = new ComponentBuilder(3);
builder3.setRowMax(2);
// for those of you out there wanting to break things - we don't validate numbers, break it all you want

// for typescript compatibility, you can cast to either MessageActionRow or ModalActionRow. toJSON accepts a generic parameter for this.
builder.toJSON<MessageActionRow>();
builder.toJSON<ModalActionRow>();

// you can also specify it when creating the builder.
const componentBuilder = new ComponentBuilder<MessageActionRow>();
const modalBuilder = new ComponentBuilder<ModalActionRow>();
```

### Embed Builder
```ts
// const { EmbedBuilder } = require("@oceanicjs/builders");
import { EmbedBuilder } from "@oceanicjs/builders";

// undefined can be used to skip uneeded parameters - don't use null!
const embed = new EmbedBuilder();

// set author - name, icon url, url
embed.setAuthor("Hello", "https://i.furry.cool/DonPeek.png", "https://furry.cool");
// the get/remove helper methods exist for most functions
console.log(embed.getAuthor()); // { name: "Hello", iconURL: "https://i.furry.cool/DonPeek.png", url: "https://furry.cool" }
embed.removeAuthor();

// set color, accepts a number
embed.setColor(0xFFA500);

// set description
embed.setDescription("hi this is some description content");
console.log(embed.getDescription()); // hi this is some description content"
embed.setDescription("separate parameters will be", "joined by newlines");
console.log(embed.getDescription()); // separate parameters will be
// joined by newlines
embed.setDescription(["arrays are also", "accepted"], ["these will also be", "joined by newlines"]);
console.log(embed.getDescription()); // arrays are also
// accepted
// these will also be
// joined by newlines

// add a field - name, value, inline (optional)
embed.addField("field name", "field value");
embed.addField("field name", "field value", true);
embed.addField("field name", "field value", false);

// add a field with a blank name & value (zero width space) - inline
embed.addBlankField();
embed.addBlankField(true);
embed.addBlankField(false);

// add multiple fields manually
embed.addFields([/*(...)*/]);

// set the footer - text, icon url
embed.setFooter("hi", "https://i.furry.cool/DonPride.png");

// set the image - url
embed.setImage("https://i.furry.cool/DonCoffee.png");

// set the timestamp - time (accepts iso timestamp, a Date instance, or "now")
embed.setTimestamp("now");
// to retrieve current value as a Date: getTimestampDate

// set the title - title
embed.setTitle("some title stuff");

// set the url - url
embed.setURL("https://furry.cool");

// convert the embed to a json object
const json = embed.toJSON();
// convert the embed into a json object, inside of an array
const jsonArray = embed.toJSON(true);

// to load an embed from json, use the static loadFromJSON method - this accepts both a singular embed, and multiple embeds
const load1 = EmbedBuilder.loadFromJSON({ title: "embed #1" }); // EmbedBuilder
const load2 = EmbedBuilder.loadFromJSON([ { title: "embed #1" }, { title: "embed #2" } ]); // [EmbedBuilder, EmbedBuilder]
// if you still want to load from an array, but want a singular instance returned, you can set the forceSingular parameter to true
// this will throw away anything but the first embed
const load1FromArray = EmbedBuilder.loadJSON([ { title: "embed #1" } ], true); // EmbedBuilder 
```

### Application Commands
```ts
// const { ApplicationCommandBuilder } = require("@oceanicjs/builders");
import { 
    ApplicationCommandBuilder,
    ApplicationCommandOptionBuilder
    } from "@oceanicjs/builders";
import {
    ApplicationCommandTypes,
    Permission,
    ApplicationCommandOptionTypes,
    ChannelTypes
} from "oceanic.js";

const chatInput = new ApplicationCommandBuilder(ApplicationCommandTypes.CHAT_INPUT, "slash-command");

// to allow or disallow usage in dms
chatInput.allowDMUsage(); // setDMPermission(true)
chatInput.disallowDMUsage(); // setDMPermission(false)

// set the default permissions required to use the command
// this accepts: bigint, string, Permission instance (from oceanic), array of permission names, permission names as arguments
chatInput.setDefaultMemberPermissions(3n);
chatInput.setDefaultMemberPermissions("3");
chatInput.setDefaultMemberPermissions(new Permission(3n));
chatInput.setDefaultMemberPermissions(["CREATE_INVITE", "KICK_MEMBERS"]);
chatInput.setDefaultMemberPermissions("CREATE_INVITE", "KICK_MEMBERS"); // provided as separate parameters

// set the description - required for chat input commands
chatInput.setDescription("Some random command");

// set the description localizations - this overrides any present localizations
chatInput.setDescriptionLocalizations({
    "es-ES": "Algún comando aleatorio"
});

// you can also add localizations individually
chatInput.addDescriptionLocalization("de", "irgendein zufälliger Befehl");

// set the name, if you want to change the earlier value for some reason
chatInput.setName("slash-command-test");

// set the name localizations - this overrides any present localizations
chatInput.setNameLocalizations({
    "es-ES": "barra-comando-prueba"
});

// you can also add localizations individually
chatInput.addNameLocalization("de", "schrägstrich-befehlstest");

// options - the add method can be used in various different ways
chatInput.addOption("option1", ApplicationCommandOptionTypes.STRING, {
    description: "Some option.",
    descriptionLocalizations: {
        "es-ES": "Alguna opción.",
        "de": "Einige Optionen."
    },
    nameLocalizations: {
        "es-ES": "opción1",
        "de": "option1"
    },
    required: true,
    choices: [ // setChoices(choices) & addChoice(name, value, nameLocalizations?)
        {
            name: "choice-1",
            value: "one",
            nameLocalizations: {
                "es-ES": "elección-1",
                "de": "wahl-1"
            }
        }
    ]
});
// or, if you prefer to use methods, you can do that too
chatInput.addOption("option2", ApplicationCommandOptionTypes.STRING, (option) => {
    // option is a new ApplicationCommandOptionBuilder instance with prefilled name & type values
    option.setDescription("Another option.")
          .setDescriptionLocalizations({
            "es-ES": "Otra opción."
          })
          .addDescriptionLocalization("de", "Andere Option.")
          .setNameLocalizations({
            "es-ES": "opción2"
          })
          .addNameLocalization("de", "option2")
          .setRequired()
          .setAutocomplete();

    // nothing needs to be returned, any return will be discarded
});

// you can also construct the ApplicationCommandOptionBuilder instance yourself
const option = new ApplicationCommandOptionBuilder(ApplicationCommandOptionTypes.CHANNEL, "channel-option")
    .setDescription("An option that accepts a channel.")
    .setDescriptionLocalizations({
        "es-ES": "Una opción que acepta un canal."
    })
    .addDescriptionLocalization("de", "Eine Option, die einen Kanal akzeptiert.")
    .setNameLocalizations({
        "es-ES": "opción-de-canal"
    })
    .addNameLocalization("de", "kanaloption")
    .setRequired(false) // same as not specifying at all
    .setChannelTypes([ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_ANNOUNCEMENT]);
    // if you want to convert the option to json for usage elsewhere, a .toJSON() method exists
chatInput.addOption(option);

// you can also do everything yourself, if you feel so inclined
chatInput.addOption({
    name: "integer-option",
    type: ApplicationCommandOptionTypes.INTEGER,
    description: "I'm tired of writing examples",
    descriptionLocalizations: {
        // Discord has no way to chose fem/masc
        "es-ES": "Estoy cansada de escribir ejemplos",
        "de": "Ich bin es leid, Beispiele zu schreiben"
    },
    nameLocalizations: {
        "es-ES": "opción-de-entero",
        "de": "integer-option"
    },
    minValue: 1, // for the builder, this is setMinMax(min, max) - this is for both values & length
    maxValue: 5
});
```

## Install
```sh
npm i @oceanicjs/builders
```
