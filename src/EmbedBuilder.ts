import type {
    EmbedAuthorOptions,
    EmbedField,
    EmbedFooterOptions,
    EmbedImageOptions,
    EmbedOptions
} from "oceanic.js";
export default class EmbedBuilder {
    private json: EmbedOptions = {};
    /**
     * create an embed builder instance (or multiple) from the provided json
     * @param json - the embed json - accepts singular & array
     * @param forceSingular - force a singular return when an array is supplied
     */
    static loadFromJSON(json: EmbedOptions): EmbedBuilder;
    static loadFromJSON<T extends boolean = false>(json: Array<EmbedOptions>, forceSingular?: T): T extends true ? EmbedBuilder : Array<EmbedBuilder>;
    static loadFromJSON(json: EmbedOptions | Array<EmbedOptions>, forceSingular?: boolean): EmbedBuilder | Array<EmbedBuilder> {
        if (Array.isArray(json)) {
            const val = json.map(v => EmbedBuilder.loadFromJSON(v));
            return forceSingular ? val[0] : val;
        } else {
            return new EmbedBuilder().load(json);
        }
    }
    /**
     * load json into this embed builder instance - use static loadFromJSON method
     * @private
     * @param {EmbedOptions} json - the json to load
     * @returns {this}
     */
    private load(json: EmbedOptions): this {
        this.json = json;
        return this;
    }

    /**
     * Add a blank field to the embed (zero width spaces).
     * @param inline If the field should be displayed inline.
     */
    addBlankField(inline?: boolean): this {
        return this.addField("\u200b", "\u200b", inline);
    }

    /**
     * Add a field to the embed.
     * @param name The field name.
     * @param value The field value.
     * @param inline If the field should be inline.
     */
    addField(name: string, value: string, inline?: boolean): this {
        this.json.fields = [...(this.json.fields ?? []), { name, value, inline }];
        return this;
    }

    /**
     * Add multiple fields.
     * @param fields - the fields to add
     */
    addFields(...fields: Array<EmbedField>): this {
        fields.forEach(arg => this.addField(arg.name, arg.value, arg.inline));
        return this;
    }

    /**
     * Get the current author.
     */
    getAuthor(): EmbedAuthorOptions | undefined {
        return this.json.author;
    }

    /**
     * Get the current color.
     */
    getColor(): number | undefined {
        return this.json.color;
    }

    /**
     * Get the current description.
     */
    getDescription(): string | undefined {
        return this.json.description;
    }

    /**
     * Get the field at the specified index.
     * @param index The index of the field to get.
     */
    getField(index: number): EmbedField | undefined {
        return (this.json.fields ?? [])[index];
    }

    /**
     * Get the current fields.
     */
    getFields(): Array<EmbedField> {
        return (this.json.fields ?? []);
    }

    /**
     * Get the current footer.
     */
    getFooter(): EmbedFooterOptions | undefined {
        return this.json.footer;
    }

    /**
     * Get the current image.
     */
    getImage(): EmbedImageOptions | undefined {
        return this.json.image;
    }

    /**
     * Get the current thumbnail.
     */
    getThumbnail(): EmbedImageOptions | undefined {
        return this.json.thumbnail;
    }

    /**
     * Get the current timestamp.
     */
    getTimestamp(): string | undefined {
        return this.json.timestamp;
    }

    /**
     * Get the current timestamp as a date instance.
     */
    getTimestampDate(): Date | undefined {
        return !this.json.timestamp ? undefined : new Date(this.json.timestamp);
    }

    /**
     * Get the current title.
     */
    getTitle(): string | undefined {
        return this.json.title;
    }
    /**
     * Get the current url.
     */
    getURL(): string | undefined {
        return this.json.url;
    }

    /**
     * remove the current author
     * @returns {this}
     */
    removeAuthor(): this {
        this.json.author = undefined;
        return this;
    }

    /**
     * Remove the current color.
     */
    removeColor(): this{
        this.json.color = undefined;
        return this;
    }

    /**
     * Remove the current description.
     */
    removeDescription(): this {
        this.json.description = undefined;
        return this;
    }

    /**
     * Remove the current footer.
     */
    removeFooter(): this {
        this.json.footer = undefined;
        return this;
    }

    /**
     * Remove the current image.
     */
    removeImage(): this {
        this.json.image = undefined;
        return this;
    }

    /**
     * Remove the current thumbnail.
     */
    removeThumbnail(): this {
        this.json.thumbnail = undefined;
        return this;
    }

    /**
     * Remove the current timestamp.
     */
    removeTimestamp(): this {
        this.json.timestamp = undefined;
        return this;
    }

    /**
     * Remove the current title.
     */
    removeTitle(): this {
        this.json.title = undefined;
        return this;
    }

    /**
     * Remove the current url.
     */
    removeURL(): this {
        this.json.url = undefined;
        return this;
    }

    /**
     * set the embed author
     * @param name The name of the author.
     * @param iconURL An icon url for the author.
     * @param url A url for the author.
     */
    setAuthor(name: string, iconURL?: string, url?: string): this {
        this.json.author = {
            name,
            iconURL,
            url
        };
        return this;
    }

    /**
     * Set the embed color.
     * @param color The color.
     */
    setColor(color: number): this {
        this.json.color = color;
        return this;
    }

    /**
     * Set the embed description.
     * @param value The description. A string, array of strings, or both spread across multiple parameters. They will be joined by LF charactes.
     */
    setDescription(first: string | Array<string>, ...other: Array<(string | Array<string>)>): this {
        this.json.description = [...(Array.isArray(first) ? first : [first]), ...(other.map(o => [...(Array.isArray(o) ? o : [o])].join("\n")))].join("\n");
        return this;
    }

    /**
     * Set the embed footer.
     * @param text - The text.
     * @param iconURL - The icon url.
     */
    setFooter(text: string, iconURL?: string): this {
        this.json.footer = { text, iconURL };
        return this;
    }

    /**
     * Set the embed image.
     * @param url The Image url.
     */
    setImage(url: string): this {
        this.json.image = { url };
        return this;
    }

    /**
     * Set the embed thumbnail.
     * @param url The thumbnail url.
     */
    setThumbnail(url: string): this {
        this.json.thumbnail = { url };
        return this;
    }

    /**
     * Set the embed timestamp.
     * @param time An ISO 8601 timestamp, Date object, or "now".
     */
    setTimestamp(time: string | Date | "now"): this {
        if (time === "now") {
            time = new Date().toISOString();
        } else if (time instanceof Date) {
            time = time.toISOString();
        }
        this.json.timestamp = time;
        return this;
    }

    /**
     * Set the embed title.
     * @param title The title.
     */
    setTitle(title: string): this {
        this.json.title = title;
        return this;
    }

    /**
     * Set the embed url.
     * @param url The url.
     */
    setURL(url: string): this {
        this.json.url = url;
        return this;
    }

    /**
     * Convert this embed to a json object.
     * @param array If the returned value should be contained in an array.
     */
    toJSON(array: true): [EmbedOptions];
    toJSON(array?: false): EmbedOptions;
    toJSON(array = false): [EmbedOptions] | EmbedOptions {
        return array ? [this.json] : this.json;
    }
}
